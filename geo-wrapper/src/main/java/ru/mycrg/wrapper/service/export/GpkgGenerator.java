package ru.mycrg.wrapper.service.export;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTile;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.queue.request.gpkg.BuildGpkgEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.BuildGpkgRastersEvent;
import ru.mycrg.wrapper.config.CrgProperties;
import ru.mycrg.wrapper.exceptions.ExportException;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class GpkgGenerator {

    private static final int TIMEOUT = 6000;

    private final Logger log = LoggerFactory.getLogger(GpkgGenerator.class);

    private final CrgProperties crgProperties;
    private final Environment environment;

    public GpkgGenerator(CrgProperties crgProperties, Environment environment) {
        this.crgProperties = crgProperties;
        this.environment = environment;
    }

    public String generate(BuildGpkgEvent event) {
        log.debug("Начали генерацию gpkg для векторных данных.");

        try {
            String rootPath = crgProperties.getExportStoragePath();
            log.debug("Путь для файлов: {}", rootPath);

            ExportProcessModel payload = event.getPayload();

            if (payload.getResourceProjections().isEmpty()) {
                throw new ExportException("Нет таблиц для экспорта");
            }

            // Переменные для команды экспорта в GeoPackage
            String host = getDBHost();
            String port = getDBPort();
            String database = event.getDbName(); // имя базы данных
            String usrName = environment.getProperty("spring.datasource.username");
            String password = environment.getProperty("spring.datasource.password");

            // Генерируем уникальное имя файла на основе количества таблиц
            String fileName = "export_" + payload.getResourceProjections()
                                                 .size() + "_tables_" + UUID.randomUUID() + ".gpkg";
            String outputPath = rootPath + fileName;

            log.debug("Экспорт {} таблиц в файл: {}", payload.getResourceProjections().size(), outputPath);

            // Создаем VRT файл для переименования слоев
            String vrtPath = generateVrt(payload, rootPath, fileName, host, port, database, usrName, password);

            // Создаем команду для экспорта через VRT файл
            String command = String.format(
                    "ogr2ogr -f GPKG \\\n" +
                            "  --config CREATE_METADATA_TABLES YES \\\n" +
                            "  -lco GEOMETRY_NAME=%s \\\n" +
                            "  -lco SPATIAL_INDEX=YES \\\n" +
                            "  -nlt PROMOTE_TO_MULTI \\\n" +
                            "  -progress \\\n" +
                            "  %s \\\n" +
                            "  %s",
                    "shape",        // имя геометрической колонки
                    outputPath,     // выходной .gpkg файл
                    vrtPath         // VRT файл
            );
            log.debug("Вызов консольной команды получения geoPackage: {}", command);

            // Выполняем команду через ProcessBuilder
            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.directory(new File(rootPath));
            processBuilder.command("sh", "-c", command);
            Process process = processBuilder.start();

            boolean isSuccess = process.waitFor(TIMEOUT, TimeUnit.SECONDS);
            if (!isSuccess) {
                log.error("Экспорт в gpkg упал по таймауту");

                throw new ExportException("Экспорт в gpkg упал по таймауту");
            }

            // Проверяем, что файл был создан
            if (Files.exists(Paths.get(outputPath))) {
                log.info("GPKG успешно создан с {} таблицами: {}", payload.getResourceProjections().size(), outputPath);

                return outputPath;
            } else {
                log.error("GPKG не был создан: {}", outputPath);

                throw new ExportException("Не удалось создать GPKG файл");
            }
        } catch (Exception e) {
            log.error("Ошибка в процессе экспорта GPKG: {}", e.getMessage(), e);

            throw new ExportException("Ошибка при экспорте в GPKG: " + e.getMessage(), e);
        }
    }

    public List<GpkgTile> generate(BuildGpkgRastersEvent event) {
        log.debug("Начали генерацию gpkg для растровых данных.");
        List<GpkgTile> tiles = new ArrayList<>();

        Optional<String> gpkgCreatedPath = Optional.ofNullable(event.getPath());

        for (Map.Entry<String, String> currentFile: event.getResourceAndPath().entrySet()) {
            String layerIdentifier = currentFile.getKey();
            String pathToTif = currentFile.getValue();

            try {
                if (gpkgCreatedPath.isEmpty()) {
                    log.debug("GPKG еще не создан. Попытка создать из растра: {}", layerIdentifier);
                    Optional<String> createdPath = generateNewGpkgFromRaster(pathToTif, layerIdentifier);

                    if (createdPath.isPresent()) {
                        gpkgCreatedPath = createdPath;
                        tiles.add(new GpkgTile(GpkgProcessStatus.COMPLETED, layerIdentifier, createdPath.get()));

                        log.info("Успешно создан GPKG с растром: {}", layerIdentifier);
                    } else {
                        String msg = String.format("Не удалось создать GPKG из растра: %s. Пробуем следующий.",
                                                   layerIdentifier);
                        GpkgTile tile = new GpkgTile(GpkgProcessStatus.ERROR, layerIdentifier, null);
                        tile.getMessages().add(msg);
                        tiles.add(tile);

                        log.warn(msg);
                    }
                } else {
                    log.debug("GPKG уже существует. Добавляем растр: {}", layerIdentifier);
                    appendRasterToGpkg(gpkgCreatedPath.get(), pathToTif, layerIdentifier);
                    tiles.add(new GpkgTile(GpkgProcessStatus.COMPLETED, layerIdentifier, gpkgCreatedPath.get()));
                }
            } catch (Exception e) {
                String msg = String.format("Ошибка при обработке растра %s: %s", layerIdentifier, e.getMessage());

                GpkgTile tile = new GpkgTile(GpkgProcessStatus.ERROR, layerIdentifier, null);
                tile.getMessages().add(msg);
                log.error(msg);
            }
        }

        if (gpkgCreatedPath.isEmpty()) {
            log.error("Не удалось создать GPKG. Все растры завершились с ошибкой.");

            throw new ExportException("Не удалось создать GPKG. Все растры завершились с ошибкой.");
        }

        return tiles;
    }

    private Optional<String> generateNewGpkgFromRaster(String pathToTif, String layerIdentifier) {
        try {
            String basePath = crgProperties.getExportStoragePath();
            String randomName = basePath + "/" + UUID.randomUUID() + ".gpkg";

            String command = String.format("gdal_translate -of GPKG -co RASTER_TABLE=%s %s %s",
                                           layerIdentifier,
                                           pathToTif,
                                           randomName);

            log.debug("Создание нового GPKG из растра. Команда: {}", command);

            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.command("sh", "-c", command);
            Process process = processBuilder.start();

            boolean isSuccess = process.waitFor(TIMEOUT, TimeUnit.SECONDS);
            if (!isSuccess) {
                log.error("Создание GPKG из растра упало по таймауту для слоя: {}", layerIdentifier);

                return Optional.empty();
            }

            int exitCode = process.exitValue();
            if (exitCode != 0) {
                log.error("Ошибка при создании GPKG из растра. Exit code: {} для слоя: {}", exitCode, layerIdentifier);

                return Optional.empty();
            }

            if (Files.exists(Paths.get(randomName))) {
                log.info("GPKG успешно создан из растра: {} для слоя: {}", randomName, layerIdentifier);
                return Optional.of(randomName);
            } else {
                log.error("GPKG файл не был создан: {} для слоя: {}", randomName, layerIdentifier);

                return Optional.empty();
            }
        } catch (Exception e) {
            log.error("Ошибка при создании GPKG из растра для слоя {}: {}", layerIdentifier, e.getMessage(), e);

            return Optional.empty();
        }
    }

    private void appendRasterToGpkg(String pathToGpkg, String pathToTif, String layerIdentifier) {
        try {
            String command = String.format(
                    "gdal_translate -of GPKG -co APPEND_SUBDATASET=YES -co RASTER_TABLE=%s %s %s",
                    layerIdentifier,
                    pathToTif,
                    pathToGpkg);

            log.debug("Добавление растра в существующий GPKG. Команда: {}", command);

            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.command("sh", "-c", command);
            Process process = processBuilder.start();

            boolean isSuccess = process.waitFor(TIMEOUT, TimeUnit.SECONDS);
            if (!isSuccess) {
                log.error("Добавление растра в GPKG упало по таймауту для слоя: {}", layerIdentifier);

                return;
            }

            int exitCode = process.exitValue();
            if (exitCode != 0) {
                log.error("Ошибка при добавлении растра в GPKG. Exit code: {} для слоя: {}", exitCode, layerIdentifier);

                return;
            }

            log.info("Растр успешно добавлен в GPKG: {} для слоя: {}", pathToGpkg, layerIdentifier);
        } catch (Exception e) {
            log.error("Ошибка при добавлении растра в GPKG для слоя {}: {}", layerIdentifier, e.getMessage(), e);
        }
    }

    private String generateVrt(ExportProcessModel payload,
                               String rootPath,
                               String fileName,
                               String host,
                               String port,
                               String database,
                               String usrName,
                               String password) {
        try {
            // Создаем имя VRT файла на основе имени GPKG файла
            String vrtFileName = fileName.replace(".gpkg", ".vrt");
            String vrtPath = rootPath + vrtFileName;

            log.debug("Создаем VRT файл: {}", vrtPath);

            StringBuilder vrtContent = new StringBuilder();
            vrtContent.append("<OGRVRTDataSource>\n");

            // Формируем строку подключения к PostgreSQL
            String pgConnection = String.format("PG:host=%s port=%s dbname=%s user=%s password=%s",
                                                host, port, database, usrName, password);

            for (var resourceProjection: payload.getResourceProjections()) {
                String schema = resourceProjection.getSchemaName();
                String table = resourceProjection.getTableName();
                String fullTableName = schema + "." + table;

                // Используем только имя таблицы без схемы как имя слоя в VRT
                log.debug("Добавляем слой в VRT: {} -> {}", fullTableName, table);

                vrtContent.append("  <OGRVRTLayer name=\"").append(table).append("\">\n");
                vrtContent.append("    <SrcDataSource>").append(pgConnection).append("</SrcDataSource>\n");
                vrtContent.append("    <SrcLayer>").append(fullTableName).append("</SrcLayer>\n");
                vrtContent.append("  </OGRVRTLayer>\n\n");
            }

            vrtContent.append("</OGRVRTDataSource>");

            // Записываем VRT файл
            try (FileWriter writer = new FileWriter(vrtPath)) {
                writer.write(vrtContent.toString());
            }

            log.debug("VRT файл успешно создан: {}", vrtPath);
            //надо бы тебя удалять после успешного процесса?
            return vrtPath;
        } catch (IOException e) {
            log.error("Ошибка при создании VRT файла: {}", e.getMessage(), e);

            throw new ExportException("Не удалось создать VRT файл: " + e.getMessage(), e);
        }
    }

    private String getDBHost() {
        String hostWithPort = environment
                .getRequiredProperty("spring.datasource.url")
                .split("//")[1]
                .split("/")[0];

        return hostWithPort.split(":")[0];
    }

    private String getDBPort() {
        String hostWithPort = environment
                .getRequiredProperty("spring.datasource.url")
                .split("//")[1]
                .split("/")[0];

        return hostWithPort.split(":")[1];
    }
}
