package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.Roles;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.resources.ResourceManager;
import ru.mycrg.data_service.service.resources.ResourceProtector;
import ru.mycrg.data_service.service.resources.ResourcesService;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.*;

import static ru.mycrg.common_utils.Paginator.getPage;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@Service
public class DocumentLibraryService implements ResourceManager {

    public static final Logger log = LoggerFactory.getLogger(DocumentLibraryService.class);

    private final SchemaService schemaService;
    private final ResourcesService resourcesService;
    private final ResourceProtector resourceProtector;
    private final PermissionsService permissionsService;
    private final DocumentLibraryRepository libraryRepository;

    public DocumentLibraryService(DocumentLibraryRepository libraryRepository,
                                  PermissionsService permissionsService,
                                  ResourceProtector resourceProtector,
                                  ResourcesService resourcesService,
                                  SchemaService schemaService) {
        this.schemaService = schemaService;
        this.resourcesService = resourcesService;
        this.resourceProtector = resourceProtector;
        this.libraryRepository = libraryRepository;
        this.permissionsService = permissionsService;
    }

    public Page<IResourceModel> getPaged(String title, Pageable pageable) {
        final List<IResourceModel> allowedLibraries = new ArrayList<>();
        libraryRepository.findByTitleContainingIgnoreCase(title)
                         .forEach(library -> {
                             defineRole(library).ifPresent(roles -> {
                                 allowedLibraries.add(new LibraryModel(library, roles));
                             });
                         });

        return getPage(allowedLibraries, pageable);
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

    private Optional<Roles> defineRole(DocumentLibrary library) {
        try {
            final ResourceIdentifier rIdentifier = new ResourceIdentifier(library.getTableName(), LIBRARY);

            final Optional<Resource> oResource = resourcesService.get(rIdentifier);
            if (oResource.isPresent()) {
                Set<String> allRoles = permissionsService.getAllRelatedRoles(oResource.get());

                return resourceProtector.defineRole(oResource.get(), allRoles);
            }

            return Optional.empty();
        } catch (Exception e) {
            log.error("Failed define role. Cause: {}", e.getCause().getMessage());

            return Optional.empty();
        }
    }
}
