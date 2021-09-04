package ru.mycrg.data_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.service.resources.ResourceManager;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dao.DatasourceFactory.SYSTEM_SCHEMA_NAME;

@Service
public class DocumentLibraryService implements ResourceManager {

    public static final ResourceQualifier docLibrariesQualifier =
            new ResourceQualifier(SYSTEM_SCHEMA_NAME, "doc_libraries");

    private final SchemaService schemaService;
    private final DocumentLibraryRepository libraryRepository;
    private final BasePermissionsRepository permissionsRepository;

    public DocumentLibraryService(DocumentLibraryRepository libraryRepository,
                                  SchemaService schemaService,
                                  BasePermissionsRepository permissionsRepository) {
        this.schemaService = schemaService;
        this.libraryRepository = libraryRepository;
        this.permissionsRepository = permissionsRepository;
    }

    public Page<IResourceModel> getPaged(String title, Pageable pageable) {
        final List<IResourceModel> allowedResources = permissionsRepository
                .findAllowedByParent(docLibrariesQualifier, ROOT_FOLDER_PATH, title, pageable).stream()
                .map(record -> new LibraryModel(record.getContent()))
                .collect(Collectors.toList());

        final long total = permissionsRepository.getTotalByParent(docLibrariesQualifier, ROOT_FOLDER_PATH, title);

        return new PageImpl<>(allowedResources, pageable, total);
    }

    public DocumentLibrary getByTableName(String tableName) {
        return libraryRepository.findByTableName(tableName)
                                .orElseThrow(() -> new NotFoundException(DocumentLibrary.class, tableName));
    }

    @Override
    public void create(ResourceQualifier rIdentifier) {
        // Not implemented yet
    }

    @Override
    public boolean isExist(ResourceQualifier rIdentifier) {
        return libraryRepository.existsByTableName(rIdentifier.getQualifier());
    }

    @Override
    public void delete(ResourceQualifier rIdentifier) {
        // Not implemented yet
    }

    public SchemaDto getSchema(String docLibId) {
        final DocumentLibrary documentLibrary = getByTableName(docLibId);

        return schemaService
                .getSchemaByName(documentLibrary.getSchemaId())
                .orElseThrow(() -> new NotFoundException("Not found schema for library: " + docLibId));
    }
}
