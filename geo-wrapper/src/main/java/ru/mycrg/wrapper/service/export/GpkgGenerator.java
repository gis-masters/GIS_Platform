package ru.mycrg.wrapper.service.export;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;
import ru.mycrg.wrapper.config.CrgProperties;
import ru.mycrg.wrapper.exceptions.ExportException;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static ru.mycrg.wrapper.dao.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;

@Service
public class GpkgGenerator {

    private static final int TIMEOUT = 600;

    private final Logger log = LoggerFactory.getLogger(GpkgGenerator.class);

    private final CrgProperties crgProperties;
    private final Environment environment;

    public GpkgGenerator(CrgProperties crgProperties, Environment environment) {
        this.crgProperties = crgProperties;
        this.environment = environment;
    }

    public String generate(ExportRequestEvent event) {
        log.debug("Start gpkg generation");

        try {
            String rootPath = crgProperties.getExportStoragePath();
            log.debug("Путь для файлов: {}", rootPath);

            ExportProcessModel payload = event.getPayload();

            if (payload.getResourceProjections().isEmpty()) {
                throw new ExportException("Нет таблиц для экспорта");
            }

            // Переменные для команды экспорта в GeoPackage
            String host = getPortGisHost();
            String port = getPortGisPort();
            String database = event.getDbName(); // имя базы данных
            String usrName = environment.getProperty("spring.datasource.username");
            String pswd = environment.getProperty("spring.datasource.password");

            // Генерируем уникальное имя файла на основе количества таблиц
            String fileName = "export_" + payload.getResourceProjections()
                                                 .size() + "_tables_" + UUID.randomUUID() + ".gpkg";
            String outputPath = rootPath + fileName;

            log.debug("Экспорт {} таблиц в файл: {}", payload.getResourceProjections().size(), outputPath);

            // Собираем все таблицы для экспорта как отдельные аргументы
            StringBuilder tablesBuilder = new StringBuilder();

            for (int i = 0; i < payload.getResourceProjections().size(); i++) {
                var resourceProjection = payload.getResourceProjections().get(i);
                String schema = resourceProjection.getSchemaName();
                String table = resourceProjection.getTableName();

                log.debug("Добавляем таблицу для экспорта: {}.{}", schema, table);

                if (i > 0) {
                    tablesBuilder.append(" \\\n  ");
                }
                tablesBuilder.append(schema).append(".").append(table);
            }

            // Создаем команду для экспорта всех таблиц в формате как в примере
            String command = String.format(
                    "ogr2ogr -f GPKG \\\n" +
                            "  --config CREATE_METADATA_TABLES YES \\\n" +
                            "  -lco GEOMETRY_NAME=%s \\\n" +
                            "  -lco SPATIAL_INDEX=YES \\\n" +
                            "  -nlt PROMOTE_TO_MULTI \\\n" +
                            "  -progress \\\n" +
                            "  %s \\\n" +
                            "  PG:\"host=%s port=%s dbname=%s user=%s password=%s\" \\\n" +
                            "  %s",
                    "shape",        // имя геометрической колонки (как в примере)
                    outputPath,     // выходной .gpkg файл
                    host,           // хост БД
                    port,           // порт БД
                    database,       // имя БД
                    usrName,        // имя пользователя
                    pswd,           // пароль
                    tablesBuilder   // все таблицы как отдельные аргументы
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

    //упразднить потом
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
}
