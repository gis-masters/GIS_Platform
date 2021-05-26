package ru.mycrg.data_service.service.resource_analyze.analyzers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.resource_analyzer_contract.*;
import ru.mycrg.resource_analyzer_contract.impl.ResourceAnalyzerResult;
import ru.mycrg.resource_analyzer_contract.impl.ResourceDefinition;

import java.io.File;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FilePhysicalExistenceAnalyzer implements IResourceAnalyzer {

    private static final Logger log = LoggerFactory.getLogger(FilePhysicalExistenceAnalyzer.class);

    @Override
    public List<IResourceAnalyzerResult> analyze(List<? extends IResource> resources) {
        checkResourcesForAppropriateType(resources);

        return resources.stream()
                        .map(this::analyzeRasterLayerForPhysicalExistence)
                        .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public List<IResourceDefinition> getResourceDefinitions() {
        return Collections.singletonList(new ResourceDefinition("RasterLayer", "Путь к растру"));
    }

    @Override
    public String getId() {
        return "FilePhysicalExistenceAnalyzer";
    }

    @Override
    public String getTitle() {
        return "Проверка наличия физического файла для растрового слоя";
    }

    @Override
    public String getErrorMessageTemplate() {
        return "{title} не имеет физического файла";
    }

    @Override
    public int getBatchSize() {
        return 5;
    }

    private void checkResourcesForAppropriateType(List<? extends IResource> resources) {
        resources.forEach(resource -> {
            if (!getResourceDefinitions().contains(resource.getResourceDefinition())) {
                throw new BadRequestException("Не подходит тип ресурса",
                                              new ErrorInfo("type", "Требуется property path"));
            }
        });
    }

    private ResourceAnalyzerResult analyzeRasterLayerForPhysicalExistence(IResource resource) {
        boolean isExistOnMachine = true;

        try {
            File file = new File(resource.getResourceProperties().get("path").toString());
            isExistOnMachine = file.exists();
            if (!file.exists()) {
                log.warn("File doesn't exist on machine: {}", resource.getId());
            }
        } catch (Exception e) {
            log.warn("Something went wrong when checking file existence on machine: {}", resource.getId());
            isExistOnMachine = false;
        }

        return new ResourceAnalyzerResult(resource.getId(), isExistOnMachine);
    }
}
