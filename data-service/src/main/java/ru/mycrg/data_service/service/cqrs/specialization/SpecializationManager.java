package ru.mycrg.data_service.service.cqrs.specialization;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class SpecializationManager {

    private static final Logger log = LoggerFactory.getLogger(SpecializationManager.class);

    private final Path specializationsRootPath;

    public SpecializationManager(Environment environment) throws IOException {
        this.specializationsRootPath = Path.of(environment.getRequiredProperty("crg-options.specializationsPath"));

        Path pathToVersion = Path.of(specializationsRootPath.toString(), "version");
        if (Files.notExists(pathToVersion)) {
            throw new IllegalStateException(
                    "Специализации не развернуты корректно. Проверьте каталог: " + specializationsRootPath);
        }

        log.info("Текущая версия специализаций: {}", Files.readString(pathToVersion));
    }

    @NotNull
    public Set<Path> getFiles(Integer specializationId) {
        Path resultPath = Path.of(specializationsRootPath.toString(),
                                  specializationId.toString(),
                                  "data");

        try (Stream<Path> stream = Files.list(resultPath)) {
            return stream.filter(Files::isRegularFile)
                         .collect(Collectors.toSet());
        } catch (IOException e) {
            log.error("Не удалось получить скрипты из каталога: {}", resultPath.toUri(), e);

            return Collections.emptySet();
        }
    }
}
