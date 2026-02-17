package ru.mycrg.wrapper.service.export;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.exceptions.ClientException;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTile;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus;
import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;
import ru.mycrg.wrapper.config.CrgProperties;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.exceptions.ExportException;
import ru.mycrg.wrapper.exceptions.ImportException;
import ru.mycrg.wrapper.service.DataServiceSpeaker;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;

@Service
public class GDALService implements IExporter {

    private static final Logger log = LoggerFactory.getLogger(GDALService.class);
    private static final int TIMEOUT = 600;

    private final Environment environment;
    private final CrgProperties crgProperties;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;
    private final DataServiceSpeaker dataServiceSpeaker;

    @Value("${spring.datasource.username}")
    private String DATASOURCE_USERNAME;

    @Value("${spring.datasource.password}")
    private String DATASOURCE_PASSWORD;

    public GDALService(CrgProperties crgProperties,
                       Environment environment,
                       BaseDaoService baseDaoService,
                       DatasourceFactory datasourceFactory,
                       DataServiceSpeaker dataServiceSpeaker) {
        this.crgProperties = crgProperties;
        this.environment = environment;
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
        this.dataServiceSpeaker = dataServiceSpeaker;
    }

    @Override
    public String generate(ExportRequestEvent event) {
        ExportProcessModel payload = event.getPayload();

        if (payload.getFormat().equals("ESRI Shapefile")) {
            String pathToZip;
            List<ResourceProjection> resourceProjections = payload.getResourceProjections();
            if (resourceProjections.size() > 1) {
                log.warn("Not implemented multiple export. Export only first feature.");

                // TODO: При имплементации импорта множества слоев необходимо генерить один большой зип.
                pathToZip = exportToShape(resourceProjections.get(0), payload.getEpsg());
            } else {
                pathToZip = exportToShape(resourceProjections.get(0), payload.getEpsg());
            }

            return pathToZip;
        } else {
            log.warn("Not supported format: {}", payload.getFormat());

            throw new ExportException("Not supported format: " + payload.getFormat());
        }
    }

    public ErrorReport importFromShape(String filePath, String dbName, String tableName, String srs) {
        ErrorReport errorReport;
        ProcessBuilder processBuilder = new ProcessBuilder();

        JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(dbName);

        String rootPath = crgProperties.getExportStoragePath();
        log.debug("Root path for import is: {}", rootPath);

        String randomDirName = UUID.randomUUID().toString();

        String shpPath = unzipFile(rootPath, randomDirName, filePath);

        errorReport = importShapeWithSourceSrs(processBuilder, dbName, tableName, srs, shpPath);
        if (!errorReport.isShpFileHasProjection()) {
            errorReport = importShapeWithoutSourceSrs(processBuilder, dbName, tableName, srs, shpPath);
        }

        if (!baseDaoService.isTableExist(jdbcTemplate, tableName)) {
            throw new ClientException("Не удалось выполнить импорт shape файла. Подробный лог на geo-wrapper");
        }
        cleanUp(processBuilder, randomDirName);

        return errorReport;
    }

    /**
     * Импорт GeoPackage в указанную схему с предварительным созданием схемы
     *
     * @param fileId     id файла gpkg как сущности платформы
     * @param dbName     Название базы данных
     * @param schemaName Название схемы
     *
     * @return ErrorReport с результатами импорта
     */
    public ErrorReport importFromGeoPackageToSchema(UUID fileId, String dbName, String schemaName) {
        JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(dbName);
        try {
            baseDaoService.createSchemaIfNotExists(jdbcTemplate, schemaName);
        } catch (SQLException e) {
            throw new ClientException(
                    "Схема со случайным именем уже существует. Останавливаем импорт!!!");
        }

        String rootPath = crgProperties.getExportStoragePath();
        log.debug("Root path for GPKG import to schema is: {}", rootPath);

        ErrorReport errorReport;
        ProcessBuilder processBuilder = new ProcessBuilder();

        String filePath;
        try {
            filePath = baseDaoService.getFilePathByUUID(jdbcTemplate, fileId);
        } catch (SQLException e) {
            throw new ClientException(
                    "Файл не найден по id '" + fileId + "'. Останавливаем импорт!!!. Причина: " + e.getMessage());
        }

        errorReport = importGeoPackageToSchemaUseSrcFromPackage(processBuilder, dbName, schemaName, filePath);

        // Если схему пустая после импорта -> явно что-то не так
        if (!isTableExistInSchema(jdbcTemplate, schemaName)) {
            throw new ClientException(
                    "Не удалось выполнить импорт GeoPackage файла в схему " + schemaName + ". Подробный лог на geo-wrapper");
        }

        return errorReport;
    }

    public Map<String, GpkgTile> importRastersFromGeoPackage(UUID fileId,
                                                             String dbName,
                                                             String token,
                                                             List<String> tilesNames) {
        JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(dbName);
        String filePath;
        Map<String, GpkgTile> createdTiles = new HashMap<>();

        try {
            filePath = baseDaoService.getFilePathByUUID(jdbcTemplate, fileId);
        } catch (SQLException e) {
            throw new ClientException(
                    "Файл не найден по id '" + fileId + "'. Останавливаем импорт!!!. Причина: " + e.getMessage());
        }

        for (String tileName: tilesNames) {
            GpkgTile tile = new GpkgTile();
            tile.setGpkgLayerTableName(tileName);

            String extractedFilePath;
            try {
                extractedFilePath = extractTiffFromGpkg(filePath, tileName);
            } catch (Exception e) {
                tile.getMessages().add("Ошибка при конвертации растра: " + e.getMessage());
                tile.setStatus(GpkgProcessStatus.ERROR);
                createdTiles.put(tileName, tile);

                continue;
            }

            try {
                Optional<UUID> oCreatedFileId = dataServiceSpeaker.postFileOnService(token,
                                                                                     new File(extractedFilePath));

                oCreatedFileId.ifPresentOrElse(
                        uuid -> {
                            tile.setTitle(String.valueOf(uuid));
                            tile.setStatus(GpkgProcessStatus.ACTIVE);
                        },
                        () -> {
                            tile.setStatus(GpkgProcessStatus.ERROR);
                            tile.getMessages()
                                .add("Неожиданная ошибка при сохранении распакованного файла на сервере!");
                        }
                );
            } catch (Exception e) {
                tile.getMessages().add("Ошибка при сохранении созданного файла на сервере: " + e.getMessage());
                tile.setStatus(GpkgProcessStatus.ERROR);
            } finally {
                new File(extractedFilePath).delete();
            }

            createdTiles.put(tileName, tile);
        }

        return createdTiles;
    }

    private String extractTiffFromGpkg(String filePath, String tileName) {
        if (!isTileExist(filePath, tileName)) {
            throw new ImportException("Таблица " + tileName + " не существует в " + filePath);
        }

        String rootPath = crgProperties.getExportStoragePath();
        String outputPath = rootPath + tileName + ".tif";

        String gdalTranslateCommand = String.format(
                "gdal_translate -of GTiff \"GPKG:%s:%s\" %s -co TILED=YES -co COMPRESS=DEFLATE -co BIGTIFF=IF_SAFER",
                filePath, tileName, outputPath
        );

        log.debug("Execute gdal_translate command: {}", gdalTranslateCommand);

        try {
            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.command("sh", "-c", gdalTranslateCommand);
            Process process = processBuilder.start();

            boolean isSuccess = process.waitFor(TIMEOUT, SECONDS);
            if (!isSuccess) {
                logStream(process.getErrorStream());
                process.destroy();

                throw new ImportException("gdal_translate failed by timeout");
            }

            logStream(process.getInputStream());
            logStream(process.getErrorStream());

            process.destroy();

            return outputPath;
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Error extracting TIFF from GPKG: {}", e.getMessage(), e);

            throw new ImportException(e.getMessage(), e);
        }
    }

    private boolean isTileExist(String filePath, String tileName) {
        String gdalinfoCommand = String.format("gdalinfo \"GPKG:%s:%s\"", filePath, tileName);
        log.debug("Вызываем gdalinfo command: {}", gdalinfoCommand);

        try {
            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.command("sh", "-c", gdalinfoCommand);
            Process process = processBuilder.start();

            boolean isSuccess = process.waitFor(TIMEOUT, SECONDS);
            if (!isSuccess) {
                logStream(process.getErrorStream());
                process.destroy();

                return false;
            }

            BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            String line;
            while ((line = errorReader.readLine()) != null) {
                if (line.contains("ERROR")) {
                    log.debug("Ратсровый слой '{}' не найден в GPKG: {}", tileName, line);
                    process.destroy();

                    return false;
                }
            }

            process.destroy();

            return true;
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Ошибка при проверки наличия тайлов в gpkg: {}", e.getMessage(), e);

            return false;
        }
    }

    /**
     * Проверить существование таблицы в указанной схеме
     *
     * @param jdbcTemplate Коннекшн к БД
     * @param schemaName   Название схемы
     *
     * @return true если таблица существует в схеме
     */
    private boolean isTableExistInSchema(JdbcTemplate jdbcTemplate, String schemaName) {
        String isTableExistQuery = String.format("SELECT EXISTS(" +
                                                         " SELECT 1" +
                                                         " FROM information_schema.tables" +
                                                         " WHERE table_schema = '%s');",
                                                 schemaName);

        log.debug("SQL isTableExistInSchema query: {}", isTableExistQuery);

        return Boolean.TRUE.equals(jdbcTemplate.queryForObject(isTableExistQuery, Boolean.class));
    }

    private String unzipFile(String rootPath, String randomDirName, String filePath) {
        try {
            Path unzipDir = Paths.get(rootPath, randomDirName);
            Files.createDirectories(unzipDir);

            try (ZipInputStream zipIn = new ZipInputStream(new FileInputStream(filePath), StandardCharsets.UTF_8)) {
                ZipEntry entry;

                while ((entry = zipIn.getNextEntry()) != null) {
                    if (entry.isDirectory()) {
                        zipIn.closeEntry();
                        continue;
                    }

                    String originalName = Paths.get(entry.getName()).getFileName().toString();
                    String safeName = sanitizeFileName(originalName, randomDirName);

                    Path extractPath = unzipDir.resolve(safeName);
                    Files.createDirectories(extractPath.getParent());

                    try (OutputStream out = Files.newOutputStream(extractPath)) {
                        byte[] buffer = new byte[8192];
                        int len;

                        while ((len = zipIn.read(buffer)) > 0) {
                            out.write(buffer, 0, len);
                        }
                    }

                    zipIn.closeEntry();
                }
            }

            List<String> shpPaths = getFilePathByExtension(unzipDir, "shp");
            if (shpPaths.size() != 1) {
                throw new ClientException("Архив содержит неверное количество shape файлов: " + shpPaths.size());
            }

            return shpPaths.get(0);
        } catch (IOException e) {
            throw new ImportException(e.getMessage(), e);
        }
    }

    private String sanitizeFileName(String fileName, String fallbackBase) {
        // Отделяем расширение
        int dot = fileName.lastIndexOf('.');
        String base = dot > 0 ? fileName.substring(0, dot) : fileName;
        String ext = dot > 0 ? fileName.substring(dot) : "";

        // Заменяем все "левые" символы на подчёркивания
        String safeBase = base.replaceAll("[^\\w.-]", "");

        // Если после очистки имя пустое — используем UUID
        if (safeBase.isBlank()) {
            safeBase = fallbackBase;
        }

        return safeBase + ext;
    }

    private ErrorReport importShapeWithSourceSrs(ProcessBuilder processBuilder,
                                                 String dbName,
                                                 String tableName,
                                                 String srs,
                                                 String shpPath) {
        String importShpToTable = getOgr2OgrImportFromSHPToTableCommand(dbName, tableName, srs, shpPath);

        log.debug("Execute import geometry from SHP console command: {}", importShpToTable);
        try {
            processBuilder.command("sh", "-c", importShpToTable);
            Process importProcess = processBuilder.start();

            boolean isSuccess = importProcess.waitFor(TIMEOUT, SECONDS);
            if (!isSuccess) {
                logStream(importProcess.getErrorStream());
                importProcess.destroy();

                throw new ImportException("Import of geometry shape failed by timeout");
            }
            ErrorReport errorReport = getErrorsFromInputStream(importProcess.getErrorStream());
            if (errorReport.getUtf8ErrorCount() > 0) {
                importProcess.destroy();

                throw new ImportException("Обработка файла прервана, кодировка объектов не равна UTF-8");
            }

            return errorReport;
        } catch (IOException | InterruptedException e) {
            // Restore interrupted state...
            Thread.currentThread().interrupt();

            throw new ImportException(e.getMessage(), e);
        }
    }

    private ErrorReport importShapeWithoutSourceSrs(ProcessBuilder processBuilder,
                                                    String dbName,
                                                    String tableName,
                                                    String srs,
                                                    String shpPath) {
        String importShpToTable = getOgr2OgrImportFromSHPToTableWithoutSourceSrs(dbName, tableName, srs, shpPath);

        log.debug("Execute import geometry from SHP without source SRS console command: {}", importShpToTable);
        try {
            processBuilder.command("sh", "-c", importShpToTable);
            Process importProcess = processBuilder.start();

            boolean isSuccess = importProcess.waitFor(TIMEOUT, SECONDS);
            if (!isSuccess) {
                logStream(importProcess.getErrorStream());
                importProcess.destroy();

                throw new ImportException("Import of geometry shape failed by timeout");
            }
            ErrorReport errorReport = getErrorsFromInputStream(importProcess.getErrorStream());
            if (errorReport.getUtf8ErrorCount() > 0) {
                importProcess.destroy();

                throw new ImportException("Обработка файла прервана, кодировка объектов не равна UTF-8");
            }

            errorReport.setShpFileHasProjection(false);
            importProcess.destroy();

            return errorReport;
        } catch (IOException | InterruptedException e) {
            // Restore interrupted state...
            Thread.currentThread().interrupt();

            throw new ImportException(e.getMessage(), e);
        }
    }

    private ErrorReport importGeoPackageToSchemaUseSrcFromPackage(ProcessBuilder processBuilder,
                                                                  String dbName,
                                                                  String schemaName,
                                                                  String gpkgPath) {
        String importGpkgToSchema = getOgr2OgrImportFromGPKGToSchema(dbName, schemaName, gpkgPath);

        log.debug("Execute import geometry from GPKG to schema without source SRS console command: {}",
                  importGpkgToSchema);
        try {
            processBuilder.command("sh", "-c", importGpkgToSchema);
            Process importProcess = processBuilder.start();

            boolean isSuccess = importProcess.waitFor(TIMEOUT, SECONDS);
            if (!isSuccess) {
                logStream(importProcess.getErrorStream());
                importProcess.destroy();

                throw new ImportException("Import of geometry GeoPackage to schema failed by timeout");
            }
            ErrorReport errorReport = getErrorsFromInputStream(importProcess.getErrorStream());

            importProcess.destroy();

            return errorReport;
        } catch (IOException | InterruptedException e) {
            // Restore interrupted state...
            Thread.currentThread().interrupt();

            throw new ImportException(e.getMessage(), e);
        }
    }

    private void cleanUp(ProcessBuilder processBuilder, String randomDirName) {
        String cleanUpAll = String.format(" rm -rf %s;", randomDirName);
        log.debug("Execute clean up directory with command : {}", cleanUpAll);
        try {
            processBuilder.command("sh", "-c", cleanUpAll);
            Process cleanUpProcess = processBuilder.start();

            boolean isSuccess = cleanUpProcess.waitFor(TIMEOUT, SECONDS);
            if (!isSuccess) {
                logStream(cleanUpProcess.getErrorStream());

                throw new ImportException("Clean up failed by timeout");
            }

            cleanUpProcess.destroy();
        } catch (IOException | InterruptedException e) {
            // Restore interrupted state...
            Thread.currentThread().interrupt();

            throw new ImportException(e.getMessage(), e);
        }
    }

    /**
     * Экспорт в шейп.
     * <p>
     * Выполняются следующие команды <p> - mkdir SOME_DIR; <p> - cd SOME_DIR; <p>
     * <br>
     * Экспорт с помощью ogr2ogr <p> - ogr2ogr -file "ESRi Shapefile" agriculture_point.shp PG:"host=localhost port=5434
     * user=DATASOURCE_USERNAME password=DATASOURCE_PASSWORD dbname=database_1" -sql "SELECT * from test1_1
     * .agriculture_point" --config SHAPE_ENCODING UTF-8;
     * <p>
     * <br>
     * Серия команд для смена 29 бита, отвечающего за кодировку для arcMap, в файле dbf.
     * <p>
     * И добавление файла .cpg для определения кодировки для Qgis
     * <p>
     * - head -c +29 heritagearea_1_1be9.dbf > head.ext // Вырезаем первые 28 байт чтобы избавиться от 29
     * <p>
     * - echo -n -e \\u0000 >> head.ext // Заполняем 29 байт пустым
     * <p>
     * - tail -c +31 heritagearea_1_1be9.dbf > tail.ext // Выделяем в отдельный файл нужный нам конец файла.
     * <p>
     * - dd if=tail.ext >> head.ext // соединяем две части
     * <p>
     * - rm heritagearea_1_1be9.dbf tail.ext
     * <p>
     * - mv head.ext heritagearea_1_1be9.dbf // заменяем dbf на новый с заменённым 29 байтом.
     * <p>
     * - echo "UTF-8" >> heritagearea_1_1be9.cpg // Добавим файл с указанием кодировки.
     * <p>
     * <br>
     * - zip -r ../agriculture.zip *; <p> - cd ..; <p> - rm -rf SOME_DIR
     *
     * @param resource         Ресурс для экспорта
     * @param requiredEpsgCode Код проекции
     *
     * @return Path к архиву
     */
    private String exportToShape(ResourceProjection resource, Integer requiredEpsgCode) {
        try {
            String rootPath = crgProperties.getExportStoragePath();
            log.debug("Root path for export is: {}", rootPath);

            String randomDirName = UUID.randomUUID().toString();
            String host = getPortGisHost();
            String port = getPortGisPort();
            String usrName = environment.getProperty("spring.datasource.username");
            String pswd = environment.getProperty("spring.datasource.password");
            String dbName = resource.getDbName();
            String schemaName = resource.getSchemaName();
            String tableName = resource.getTableName();
            SchemaDto schema = resource.getSchema();
            String geomType = schema.getGeometryType().getType().toUpperCase();

            Integer tableEpsgCode = requiredEpsgCode;
            try {
                tableEpsgCode = Integer.valueOf(resource.getCrs().split(":")[1]);
            } catch (Exception e) {
                log.warn("Не удалось получить EPSG код таблицы => {}", e.getMessage());
            }

            String mkdirAndCd = String.format("mkdir %s; cd %s;", randomDirName, randomDirName);
            String exportAShp = getOgr2OgrExportCmd(host, port, usrName, pswd, dbName, schemaName, tableName,
                                                    geomType, requiredEpsgCode, tableEpsgCode);
            String getTheHead = String.format(" head -c 29 %s.dbf > head.ext;", tableName);
            String getTheTail = String.format(" tail -c +31 %s.dbf > tail.ext;", tableName);
            String fillHead1b = " dd if=tail.ext bs=1 count=1 >> head.ext;";
            String collectAll = " dd if=tail.ext >> head.ext;";
            String removeSome = String.format(" rm %s.dbf tail.ext;", tableName);
            String renameFile = String.format(" mv head.ext %s.dbf;", tableName);
            String addCpgFile = String.format(" echo \"UTF-8\" >> %s.cpg;", tableName);
            String archiveAll = String.format(" zip -r ../%s.zip *;", tableName);
            String cleanUpAll = String.format(" cd ..; rm -rf %s;", randomDirName);

            String allInOneCommand = mkdirAndCd + exportAShp + getTheHead + getTheTail + fillHead1b + collectAll +
                    removeSome + renameFile + addCpgFile + archiveAll + cleanUpAll;

            log.debug("Execute export to SHP console command: {}", allInOneCommand);

            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.directory(new File(rootPath));
            processBuilder.command("sh", "-c", allInOneCommand);
            Process process = processBuilder.start();
            final boolean isSuccess = process.waitFor(TIMEOUT, SECONDS);
            if (!isSuccess) {
                logStream(process.getErrorStream());

                throw new ExportException("Export failed by timeout");
            }

            logStream(process.getInputStream());

            String pathToResultZip = rootPath + resource.getTableName() + ".zip";
            if (Files.exists(Paths.get(pathToResultZip))) {
                return pathToResultZip;
            } else {
                log.info("Path to result ZIP file: {}", pathToResultZip);

                throw new ExportException("Не удалось выполнить консольную команду");
            }
        } catch (IOException | InterruptedException e) {
            // Restore interrupted state...
            Thread.currentThread().interrupt();

            throw new ExportException(e.getMessage(), e);
        }
    }

    private String getOgr2OgrExportCmd(String host, String port, String userName, String password, String dbName,
                                       String schemaName, String tableName, String geomType,
                                       Integer newEpsgCode, Integer currentEpsgCode) {
        return String.format("ogr2ogr -f \"ESRi Shapefile\" -t_srs EPSG:%d -s_srs EPSG:%d %s.shp " +
                                     "PG:\"host=%s port=%s user=%s password=%s dbname=%s\" " +
                                     "-nlt %s -sql \"SELECT * from %s.%s\" --config SHAPE_ENCODING UTF-8;",
                             newEpsgCode, currentEpsgCode, tableName, host, port, userName, password, dbName, geomType,
                             schemaName, tableName);
    }

    private String getOgr2OgrImportFromSHPToTableCommand(String dbName, String tableName, String srs, String filePath) {
        return String.format("ogr2ogr -skipfailures -f \"PostgreSQL\" PG:\"host=postgis user=%s password=%s " +
                                     "port=5432 dbname=%s\" -nln %s -nlt PROMOTE_TO_MULTI -t_srs \"%s\" %s;",
                             DATASOURCE_USERNAME,
                             DATASOURCE_PASSWORD,
                             dbName,
                             tableName,
                             srs,
                             filePath);
    }

    private String getOgr2OgrImportFromSHPToTableWithoutSourceSrs(String dbName, String tableName, String srs,
                                                                  String filePath) {
        return String.format("ogr2ogr -skipfailures -f \"PostgreSQL\" PG:\"host=postgis user=%s password=%s " +
                                     "port=5432 dbname=%s\" -nln %s -nlt PROMOTE_TO_MULTI -s_srs \"%s\" -t_srs \"%s\" %s;",
                             DATASOURCE_USERNAME,
                             DATASOURCE_PASSWORD,
                             dbName,
                             tableName,
                             srs,
                             srs,
                             filePath);
    }

    /**
     * Создает команду ogr2ogr для импорта GeoPackage в указанную схему
     *
     * @param dbName     Название базы данных
     * @param schemaName Название схемы
     * @param filePath   Путь к файлу GeoPackage
     *                   <p>
     *                   -Можно использовать флаг -progress, но он работает в специфических условиях.
     *
     * @return Команда ogr2ogr
     */
    private String getOgr2OgrImportFromGPKGToSchema(String dbName,
                                                    String schemaName,
                                                    String filePath) {
        return String.format("ogr2ogr -skipfailures -f \"PostgreSQL\" " +
                                     "PG:\"host=postgis user=%s password=%s port=5432 dbname=%s\" " +
                                     "-lco SCHEMA=%s -lco GEOMETRY_NAME=shape -nlt PROMOTE_TO_MULTI " +
                                     " --config PG_USE_COPY YES %s;",
                             DATASOURCE_USERNAME,
                             DATASOURCE_PASSWORD,
                             dbName,
                             schemaName,
                             filePath);
    }

    private void logStream(InputStream inputStream) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String line;
        while ((line = reader.readLine()) != null) {
            log.debug("export console output: {}", line);
        }
    }

    private ErrorReport getErrorsFromInputStream(InputStream inputStream) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        ErrorReport errorReport = new ErrorReport();
        int failedRecordCount = 0;
        int utf8ErrorCount = 0;

        String line;
        while ((line = reader.readLine()) != null) {
            log.debug("ErrorStream. Export console output: {}", line);
            if (containsIgnoreCase(line, "COPY statement failed")) {
                failedRecordCount++;
            }

            if (containsIgnoreCase(line, "UTF8")) {
                utf8ErrorCount++;
            }

            if (containsIgnoreCase(line, "Can't transform coordinates, source layer has no")) {
                log.debug("No CRS in shape file {}", line);
                errorReport.setShpFileHasProjection(false);
            }
        }
        errorReport.setFailedRecordCount(failedRecordCount);
        log.debug("ErrorStream: failed records count {}", failedRecordCount);
        log.debug("ErrorStream: failed UTF8 count {}", utf8ErrorCount);
        errorReport.setUtf8ErrorCount(utf8ErrorCount);

        return errorReport;
    }

    private String getPortGisHost() {
        String hostWithPort = environment
                .getRequiredProperty("spring.datasource.url")
                .split("//")[1]
                .split("/")[0];

        return hostWithPort.split(":")[0];
    }

    private String getPortGisPort() {
        String hostWithPort = environment
                .getRequiredProperty("spring.datasource.url")
                .split("//")[1]
                .split("/")[0];

        return hostWithPort.split(":")[1];
    }

    private List<String> getFilePathByExtension(Path path, String extension) {
        if (!Files.isDirectory(path)) {
            throw new IllegalArgumentException("Path must be a directory!");
        }

        List<String> result = new ArrayList<>();

        try (Stream<Path> walk = Files.walk(path)) {
            result = walk
                    .filter(p -> !Files.isDirectory(p))
                    .map(Path::toString)
                    .filter(f -> f.endsWith(extension))
                    .collect(Collectors.toList());
        } catch (IOException ex) {
            log.error("Error while getting files with {} extension from directory {}", extension, path.toUri());
        }

        return result;
    }
}
