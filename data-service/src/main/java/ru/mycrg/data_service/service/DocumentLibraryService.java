package ru.mycrg.data_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.Roles;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.resources.ResourceManager;
import ru.mycrg.data_service.service.resources.ResourceProtector;
import ru.mycrg.data_service.service.resources.ResourcesService;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@Service
public class DocumentLibraryService implements ResourceManager {

    private final SchemaService schemaService;
    private final ResourcesService resourcesService;
    private final ResourceProtector resourceProtector;
    private final DocumentLibraryRepository libraryRepository;

    public DocumentLibraryService(DocumentLibraryRepository libraryRepository,
                                  ResourceProtector resourceProtector,
                                  ResourcesService resourcesService,
                                  SchemaService schemaService) {
        this.schemaService = schemaService;
        this.resourcesService = resourcesService;
        this.resourceProtector = resourceProtector;
        this.libraryRepository = libraryRepository;
    }

    public Page<IResourceModel> getPaged(String title, Pageable pageable, Authentication authentication) {
        final List<IResourceModel> allowedLibraries = new ArrayList<>();
        libraryRepository
                .findByTitleContainingIgnoreCase(title)
                .forEach(library -> {
                    final ResourceIdentifier rIdentifier = new ResourceIdentifier(library.getTableName(), LIBRARY);

                    final Optional<Resource> oResource = resourcesService.get(rIdentifier, authentication);
                    if (oResource.isPresent()) {
                        final Resource resource = oResource.get();

                        Roles role = resourceProtector.defineRole(resource, authentication)
                                                      .orElseThrow(() -> new ForbiddenException("Can't define role"));

                        allowedLibraries.add(new LibraryModel(library, role));
                    }
                });

        return new PageImpl<>(allowedLibraries, pageable, allowedLibraries.size());
    }

    @Override
    public void create(ResourceIdentifier rIdentifier) {
        // Not implemented yet
    }

    @Override
    public boolean isExist(ResourceIdentifier rIdentifier) {
        return libraryRepository.existsByTableName(rIdentifier.toString());
    }

    @Override
    public void delete(ResourceIdentifier rIdentifier) {
        // Not implemented yet
    }

    public SchemaDto getSchema(String docLibId) {
        final DocumentLibrary documentLibrary = libraryRepository
                .findByTableName(docLibId)
                .orElseThrow(() -> new NotFoundException("Not found library: " + docLibId));

        return schemaService
                .getSchemaByName(documentLibrary.getSchemaId())
                .orElseThrow(() -> new NotFoundException("Not found schema for library: " + docLibId));
    }

    public void checkObjectBySchema(Map<String, Object> body, String docLibId) {
        schemaService.checkObjectBySchema(body, docLibId);
    }
}
