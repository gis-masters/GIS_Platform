package ru.mycrg.gis_service.service.specialization;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.security.util.InMemoryResource;
import org.springframework.stereotype.Service;
import ru.mycrg.gis_service.exceptions.CrgPSqlException;
import ru.mycrg.gis_service.exceptions.GisServiceException;

import javax.sql.DataSource;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static ru.mycrg.gis_service.service.ErrorDetailsExtractor.extractDetails;

@Service
public class SpecializationService {

    private static final Logger log = LoggerFactory.getLogger(SpecializationService.class);

    private final DataSource dataSource;

    private final Path specializationsRootPath;

    public SpecializationService(DataSource dataSource,
                                 Environment environment) {
        this.dataSource = dataSource;

        this.specializationsRootPath = Path.of(environment.getRequiredProperty("crg-options.specializationsPath"));
    }

    public Set<String> getResources(Integer id) {
        return getFiles(id).stream()
                           .map(path -> path.getFileName().toString())
                           .collect(Collectors.toSet());
    }

    public void initSpecialization(@NotNull Integer specializationId,
                                   @NotNull Map<String, String> params) {
        log.info("Init specialization: {} on GIS", specializationId);

        try (Connection connection = dataSource.getConnection()) {
            List<Path> sortedScripts = getFiles(specializationId)
                    .stream()
                    .sorted(bySequenceNumber())
                    .collect(Collectors.toList());

            log.info("Специализация: {}. Начинаю выполнять скрипты: {}", specializationId, sortedScripts);

            sortedScripts.forEach(pathToScript -> {
                try {
                    String scriptContent = Files.readString(pathToScript);

                    if (!params.isEmpty()) {
                        log.info("Подменяем шаблоны присланными значениями: {}", params);

                        // Замена шаблонов
                        for (Map.Entry<String, String> entry: params.entrySet()) {
                            String placeholder = entry.getKey();
                            String replacement = entry.getValue();
                            scriptContent = scriptContent.replace(placeholder, replacement);
                        }
                    }

                    ScriptUtils.executeSqlScript(connection, new InMemoryResource(scriptContent));
                } catch (Exception e) {
                    String msg = String.format("Не удалось выполнить скрипт: '%s'", pathToScript.getFileName());

                    throw new CrgPSqlException(msg, extractDetails(e));
                }
            });
        } catch (CrgPSqlException e) {
            String msg = String.format("Не удалось развернуть специализацию: '%d' => %s",
                                       specializationId, e.getMessage());
            log.error(msg, e);

            throw new GisServiceException(msg, e.getDetails());
        } catch (Exception e) {
            String msg = String.format("Не удалось развернуть специализацию: '%d'", specializationId);
            log.error(msg, e);

            throw new GisServiceException(msg);
        }
    }

    @NotNull
    public Set<Path> getFiles(Integer specializationId) {
        Path resultPath = Path.of(specializationsRootPath.toString(),
                                  specializationId.toString(),
                                  "gis");

        try (Stream<Path> stream = Files.list(resultPath)) {
            return stream.filter(Files::isRegularFile)
                         .collect(Collectors.toSet());
        } catch (IOException e) {
            log.error("Не удалось получить скрипты из каталога: {}", resultPath.toUri(), e);

            return Collections.emptySet();
        }
    }

    private static Comparator<Path> bySequenceNumber() {
        return Comparator.comparingInt(path -> {
            String fileName = path.getFileName().toString().toLowerCase();
            String numberAsString = fileName.split("__")[0].replace("v", "");

            return numberAsString.isBlank()
                    ? 0
                    : Integer.parseInt(numberAsString);
        });
    }
}
