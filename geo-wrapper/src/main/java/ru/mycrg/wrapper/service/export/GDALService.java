package ru.mycrg.wrapper.service.export;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;
import ru.mycrg.wrapper.config.CrgProperties;
import ru.mycrg.wrapper.exceptions.ExportException;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import static java.util.concurrent.TimeUnit.SECONDS;

@Service
public class GDALService implements IExporter {

    private static final Logger log = LoggerFactory.getLogger(GDALService.class);

    private final Environment environment;
    private final CrgProperties crgProperties;

    public GDALService(CrgProperties crgProperties, Environment environment) {
        this.crgProperties = crgProperties;
        this.environment = environment;
    }

    @Override
    public String generate(ExportRequestEvent event) {
        ExportProcessModel payload = event.getPayload();

        String pathToZip;

        if (payload.getFormat().equals("ESRI Shapefile")) {
            List<ResourceProjection> resourceProjections = payload.getResourceProjections();
            if (resourceProjections.size() > 1) {
                log.warn("Not implemented multiple export. Export only first feature.");

                // TODO: При имплементации импорта множества слоев необходимо генерить один большой зип.
                pathToZip = exportToShape(resourceProjections.get(0));
            } else {
                pathToZip = exportToShape(resourceProjections.get(0));
            }

            return pathToZip;
        } else {
            log.warn("Not supported format: {}", payload.getFormat());

            throw new ExportException("Not supported format: " + payload.getFormat());
        }
    }

    /**
     * Экспорт в шейп.
     * <p>
     * Выполняются следующие команды <p>
     *     - mkdir SOME_DIR; <p>
     *     - cd SOME_DIR; <p>
     *     - ogr2ogr -file "ESRi Shapefile" agriculture_point.shp PG:"host=localhost port=5434 user=fiz password=314
     *       dbname=database_1" -sql "SELECT * from test1_1.agriculture_point" --config SHAPE_ENCODING UTF-8; <p>
     *     - zip -r ../agriculture.zip *; <p>
     *     - cd ..; <p>
     *     - rm -rf SOME_DIR
     *
     * @param resource Ресурс для экспорта
     *
     * @return Path к архиву
     */
    private String exportToShape(ResourceProjection resource) {
        try {
            String rootPath = crgProperties.getExportStoragePath();
            log.debug("Root path for export is: {}", rootPath);

            String randomDirName = UUID.randomUUID().toString();
            String host = getPortGisHost();
            String port = getPortGisPort();
            String userName = environment.getProperty("spring.datasource.username");
            String password = environment.getProperty("spring.datasource.password");
            String dbName = resource.getDbName();
            String schemaName = resource.getSchemaName();
            String tableNAme = resource.getTableName();

            String allInOneCommandTest = "mkdir " + randomDirName + "; cd " + randomDirName + "; " +
                    "ogr2ogr -f \"ESRi Shapefile\" " + resource.getTableName() + ".shp PG:\"host=" + host + " port=" + port + " " +
                    "user=" + userName + " password=" + password + " dbname=" + dbName + "\" -sql \"SELECT * from " + schemaName + "." + tableNAme + "\" --config SHAPE_ENCODING UTF-8; " +
                    "zip -r ../" + resource.getTableName() + ".zip *; cd ..; rm -rf " + randomDirName;

            log.debug("execute command: {}", allInOneCommandTest);

            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.directory(new File(rootPath));
            processBuilder.command("sh", "-c", allInOneCommandTest);
            Process process = processBuilder.start();
            final boolean isSuccess = process.waitFor(20, SECONDS);
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

    private void logStream(InputStream inputStream) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String line;
        while ((line = reader.readLine()) != null) {
            log.debug("export console output: {}", line);
        }
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
}
