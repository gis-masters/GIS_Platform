package ru.mycrg.data_service.service.resource_analyze.queries;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.FileResourceDto;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.resource_analyzer_contract.IResource;
import ru.mycrg.resource_analyzer_contract.IResourceDefinition;
import ru.mycrg.resource_analyzer_contract.IResourceQueryService;
import ru.mycrg.resource_analyzer_contract.impl.Resource;
import ru.mycrg.resource_analyzer_contract.impl.ResourceDefinition;

import java.util.HashMap;
import java.util.Map;

@Service
public class FileInnerPathQuery implements IResourceQueryService {

    private final DocumentLibraryService documentLibraryService;
    private final ResourceDefinition resourceDefinition;

    public FileInnerPathQuery(DocumentLibraryService documentLibraryService) {
        this.documentLibraryService = documentLibraryService;

        resourceDefinition = new ResourceDefinition("LibrariesFilePaths", "Путь к файлу из библиотеки документов");
    }

    public Page<IResource> getResources(Pageable pageable) {
        return documentLibraryService.getAllFilePathForAllLibraries(pageable)
                                     .map(this::filePathMapToResource);
    }

    @Override
    public IResourceDefinition getResourceDefinition() {
        return resourceDefinition;
    }

    private IResource filePathMapToResource(FileResourceDto fileResource) {
        Map<String, Object> resProps = new HashMap<>();
        resProps.put("libraryName", fileResource.getLibraryName());
        resProps.put("innerPath", fileResource.getInnerPath());

        return new Resource("LibrariesFilePaths", "library document inner path", resourceDefinition, resProps);
    }
}
