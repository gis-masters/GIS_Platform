package ru.mycrg.data_service.service.analyzers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.resource_analyzer_contract.*;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FilePhysicalExistenceAnalyzer implements IResourceAnalyzer {

    private static final Logger log = LoggerFactory.getLogger(FilePhysicalExistenceAnalyzer.class);

    public FilePhysicalExistenceAnalyzer() {
        //Required by framework
    }

    @Override
    public List<IResourceAnalyzerResult> analyze(List<? extends IResource> resources) {
        checkResourcesForAppropriateType(resources);

        return resources.stream()
                        .map(this::analyzeRasterLayerForPhysicalExistence)
                        .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public IResourceDefinition getResourceDefinition() {
        return new ResourceDefinitionImpl("FilePath", "Путь к файлу");
    }

    @Override
    public String getId() {
        return "FilePhysicalExistenceAnalyzer";
    }

    @Override
    public String getTitle() {
        return "Проверка наличия физического файла для расстрового слоя";
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
            if (!isResourceTypeSame(resource)) {
                throw new BadRequestException("Не подходит тип ресурса",
                                              new ErrorInfo("type", "Требуется property path"));
            }
        });
    }

    private boolean isResourceTypeSame(IResource resource) {
        return resource.getResourceProperties().containsKey("path");
    }

    private ResourceAnalyzerResultImpl analyzeRasterLayerForPhysicalExistence(IResource resource) {
        boolean isExistOnMachine = true;

        try {
            File file = new File(resource.getResourceProperties().get("path").toString());
            isExistOnMachine = file.exists();
            if (!file.exists()) {
                log.warn("file doesn't exist on machine: {}", resource.getId());
            }
        } catch (Exception e) {
            log.warn("something went wrong when checking file existence on machine: {}", resource.getId());
            isExistOnMachine = false;
        }

        return new ResourceAnalyzerResultImpl(resource.getId(), isExistOnMachine);
    }
}
