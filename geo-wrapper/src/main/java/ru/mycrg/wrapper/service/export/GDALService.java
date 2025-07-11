package ru.mycrg.wrapper.service.export;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.exceptions.ClientException;
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

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

    @Value("${spring.datasource.username}")
    private String DATASOURCE_USERNAME;

    @Value("${spring.datasource.password}")
    private String DATASOURCE_PASSWORD;

    public GDALService(CrgProperties crgProperties,
                       Environment environment,
                       BaseDaoService baseDaoService,
                       DatasourceFactory datasourceFactory) {
        this.crgProperties = crgProperties;
        this.environment = environment;
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
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

        String shpPath = unzipFile(processBuilder, rootPath, randomDirName, filePath);

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

    private String unzipFile(ProcessBuilder processBuilder, String rootPath, String randomDirName, String filePath) {
        try {
            String cdDir = String.format("cd %s;", rootPath);

            String mkDir = String.format("mkdir %s;", randomDirName);
            String unzipFile = String.format("unzip %s -d %s", filePath, randomDirName);
            String allInOneCommand = cdDir + mkDir + unzipFile;

            log.debug("Execute unzip archive console command: {}", allInOneCommand);

            processBuilder.directory(new File(rootPath));
            processBuilder.command("sh", "-c", allInOneCommand);
            Process unzipProcess = processBuilder.start();

            boolean isSuccess = unzipProcess.waitFor(TIMEOUT, SECONDS);
            if (!isSuccess) {
                logStream(unzipProcess.getErrorStream());

                throw new ImportException("Unzip failed by timeout");
            }
            unzipProcess.destroy();

            Path unzipDir = Path.of(String.format("%s/%s", rootPath, randomDirName));
            List<String> shpPaths = getFilePathByExtension(unzipDir, "shp");
            if (shpPaths.size() != 1) {
                throw new ClientException("Архив содержит неверное количество shape файлов: " + shpPaths.size());
            }

            return shpPaths.get(0);
        } catch (IOException | InterruptedException e) {
            // Restore interrupted state...
            Thread.currentThread().interrupt();

            throw new ImportException(e.getMessage(), e);
        }
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
                                     "port=5432 dbname=%s\" -nln %s -t_srs \"%s\" %s;",
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
                                     "port=5432 dbname=%s\" -nln %s -s_srs \"%s\" -t_srs \"%s\" %s;",
                             DATASOURCE_USERNAME,
                             DATASOURCE_PASSWORD,
                             dbName,
                             tableName,
                             srs,
                             srs,
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
