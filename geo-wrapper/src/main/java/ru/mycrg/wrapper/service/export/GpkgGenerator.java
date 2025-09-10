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

            // Переменные-болванки для команды экспорта в GeoPackage
            String host = getPortGisHost();
            String port = getPortGisPort();
            String database = event.getDbName(); // имя базы данных
            String schema = payload.getResourceProjections().get(0).getSchemaName(); // схема базы данных
            String table = payload.getResourceProjections().get(0).getTableName(); // имя таблицы для экспорта

            // Генерируем уникальное имя файла
            String fileName = table + "_" + UUID.randomUUID() + ".gpkg";
            String outputPath = rootPath + fileName;

            String usrName = environment.getProperty("spring.datasource.username");
            String pswd = environment.getProperty("spring.datasource.password");

            // Команда ogr2ogr для экспорта из PostgreSQL в GeoPackage
            String command = String.format(
                    "ogr2ogr -f GPKG %s PG:\"host=%s port=%s dbname=%s user=%s password=%s\" %s.%s %s",
                    outputPath,     // выходной .gpkg файл
                    host,           // хост БД
                    port,           // порт БД
                    database,       // имя БД
                    usrName,        // имя пользователя
                    pswd,           // пароль
                    schema,         // схема
                    table,          // таблица
                    "-lco GEOMETRY_NAME=" + DEFAULT_GEOMETRY_COLUMN_NAME // имя геометрической колонки
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
                log.info("GPKG успешно создан: {}", outputPath);

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
