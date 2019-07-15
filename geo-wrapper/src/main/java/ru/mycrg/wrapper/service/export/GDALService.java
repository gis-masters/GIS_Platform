package ru.mycrg.wrapper.service.export;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.common.MqExportProcessRequest;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.wrapper.config.CrgProperties;
import ru.mycrg.wrapper.exceptions.ExportException;
import ru.mycrg.wrapper.service.FileService;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class GDALService implements IExporter {

    private static final Logger log = LoggerFactory.getLogger(GDALService.class);

    private final Environment environment;
    private final CrgProperties crgProperties;
    private final FileService fileService;

    public GDALService(FileService fileService, CrgProperties crgProperties, Environment environment) {
        this.fileService = fileService;
        this.crgProperties = crgProperties;
        this.environment = environment;
    }

    @Override
    public Map<String, String> generate(MqExportProcessRequest request) throws ExportException {
        if (request.getFormat().equals("ESRI Shapefile")) {
            List<ResourceProjection> resourceProjections = request.getResourceProjections();
            if (resourceProjections.size() > 1) {
                log.warn("Not implemented multiple export. Export only first feature.");

                return tryExport(resourceProjections.get(0), request.getFormat());
            } else {
                return tryExport(resourceProjections.get(0), request.getFormat());
            }
        } else {
            log.warn("Not supported format: {}", request.getFormat());

            throw new ExportException("Not supported format: " + request.getFormat());
        }
    }

    private Map<String, String> tryExport(ResourceProjection resource, String format) {
        try {
            String storagePath = crgProperties.getExportStoragePath();
            String fileName = resource.getTableName() + ".shp";
            String localhost = getPortGisHost();
            String port = getPortGisPort();
            String userName = environment.getProperty("spring.datasource.username");
            String password = environment.getProperty("spring.datasource.password");
            String dbName = resource.getDbName();
            String schemaName = resource.getSchemaName();
            String tableNAme = resource.getTableName();

            String command = "ogr2ogr -f \"" + format + "\" " + fileName + " PG:\"host=" + localhost + " " +
                    "port=" + port + " user=" + userName + " password=" + password + " dbname=" + dbName + "\" -sql " +
                    "\"SELECT * from " + schemaName + "." + tableNAme + "\" --config SHAPE_ENCODING UTF-8 -progress";

            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.directory(new File(storagePath));
            processBuilder.command("sh", "-c", command);

            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

            int exitCode = process.waitFor();
            assert exitCode == 0;

            return Collections.emptyMap();
        } catch (IOException | InterruptedException e) {
            throw new ExportException(e.getMessage(), e);
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
