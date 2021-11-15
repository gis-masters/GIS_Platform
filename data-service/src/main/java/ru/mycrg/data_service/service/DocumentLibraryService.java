package ru.mycrg.data_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@Service
public class DocumentLibraryService {

    private final SchemaService schemaService;
    private final DocumentLibraryRepository libraryRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final BasePermissionsRepository permissionsRepository;

    public DocumentLibraryService(DocumentLibraryRepository libraryRepository,
                                  SchemaService schemaService,
                                  IAuthenticationFacade authenticationFacade,
                                  BasePermissionsRepository permissionsRepository) {
        this.schemaService = schemaService;
        this.libraryRepository = libraryRepository;
        this.authenticationFacade = authenticationFacade;
        this.permissionsRepository = permissionsRepository;
    }

    public Page<IResourceModel> getPaged(String title, Pageable pageable) {
        if (authenticationFacade.isOrganizationAdmin()) {
            Page<LibraryModel> page = libraryRepository.findAllByTitleContainingIgnoreCase(title, pageable)
                                                       .map(LibraryModel::new);

            List<IResourceModel> temp = page
                    .stream()
                    .filter(libraryModel -> !libraryModel.getTitle().equals("System root directory"))
                    .collect(Collectors.toList());

            return new PageImpl<>(temp, pageable, page.getTotalElements());
        }

        ResourceQualifier dlQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, "doc_libraries", LIBRARY);
        List<IResourceModel> allowedResources = permissionsRepository
                .findAllowedByParent(dlQualifier, ROOT_FOLDER_PATH, title, pageable).stream()
                .map(record -> new LibraryModel(record.getContent()))
                .collect(Collectors.toList());

        long total = permissionsRepository.getTotalByParent(dlQualifier, ROOT_FOLDER_PATH, title);

        return new PageImpl<>(allowedResources, pageable, total);
    }

    public IResourceModel getInfo(String tableName) {
        DocumentLibrary dl = libraryRepository
                .findByTableName(tableName)
                .orElseThrow(() -> new NotFoundException(DocumentLibrary.class, tableName));

        if (authenticationFacade.isOrganizationAdmin()) {
            return new LibraryModel(dl, "OWNER");
        }

        Optional<String> oRole = permissionsRepository.getRoleForLibrary(tableName);
        if (oRole.isPresent()) {
            return new LibraryModel(dl, oRole.get());
        } else {
            throw new ForbiddenException("Недостаточно прав для просмотра библиотеки: " + tableName);
        }
    }

    public boolean isExist(ResourceQualifier rIdentifier) {
        return libraryRepository.existsByTableName(rIdentifier.getQualifier());
    }

    public SchemaDto getSchema(String docLibId) {
        return schemaService
                .getSchemaByName(getInfo(docLibId).getSchemaId())
                .orElseThrow(() -> new NotFoundException("Не найдена схема библиотеки: " + docLibId));
    }
}
