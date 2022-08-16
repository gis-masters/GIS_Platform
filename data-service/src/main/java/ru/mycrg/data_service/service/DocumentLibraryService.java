package ru.mycrg.data_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.DocumentLibraryDao;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dto.FileResourceDto;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.ContentTypes;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildInSection;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@Service
public class DocumentLibraryService {

    private final SchemaService schemaService;
    private final DocumentLibraryRepository libraryRepository;
    private final DocumentLibraryDao libraryDao;
    private final RecordsDao recordsDao;
    private final IAuthenticationFacade authenticationFacade;
    private final BasePermissionsRepository permissionsRepository;

    @Value("${crg-options.fileStoragePath}")
    private String defaultPath;

    public DocumentLibraryService(DocumentLibraryRepository libraryRepository,
                                  SchemaService schemaService,
                                  DocumentLibraryDao libraryDao,
                                  RecordsDao recordsDao,
                                  IAuthenticationFacade authenticationFacade,
                                  BasePermissionsRepository permissionsRepository) {
        this.schemaService = schemaService;
        this.libraryRepository = libraryRepository;
        this.libraryDao = libraryDao;
        this.recordsDao = recordsDao;
        this.authenticationFacade = authenticationFacade;
        this.permissionsRepository = permissionsRepository;
    }

    public Page<IResourceModel> getPaged(String ecqlFilter, Pageable pageable) {
        long totalLibraries;
        List<IResourceModel> libraries;

        if (authenticationFacade.isOrganizationAdmin()) {
            libraries = libraryDao.findAll(ecqlFilter, pageable).stream()
                                  .map(LibraryModel::new)
                                  .collect(Collectors.toList());

            totalLibraries = libraryDao.getTotal(ecqlFilter);
        } else {
            ResourceQualifier dlQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, "doc_libraries", LIBRARY);
            libraries = permissionsRepository
                    .findAllowedByParent(dlQualifier, ROOT_FOLDER_PATH, ecqlFilter, null, pageable).stream()
                    .map(recordDto -> new LibraryModel(recordDto.getContent()))
                    .collect(Collectors.toList());

            totalLibraries = permissionsRepository.getTotalByParent(dlQualifier, ROOT_FOLDER_PATH, ecqlFilter);
        }

        List<IResourceModel> allowedLibraries = libraries
                .stream()
                .filter(libraryModel -> !libraryModel.getTitle().equals("System root directory"))
                .collect(Collectors.toList());

        return new PageImpl<>(allowedLibraries, pageable, totalLibraries);
    }

    /**
     * Increment registry number.
     *
     * @param libraryId Library identifier
     *
     * @return Old registry number.
     */
    public Long incrementRegistryNumber(String libraryId) {
        DocumentLibrary library = libraryRepository
                .findByTableName(libraryId)
                .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: " + libraryId));

        Long oldRegistryNumber = library.getRegistryCounter();
        library.setRegistryCounter(oldRegistryNumber + 1);
        library.setLastModified(LocalDateTime.now());

        libraryRepository.save(library);

        return oldRegistryNumber;
    }

    public IResourceModel getInfo(String libraryId) {
        DocumentLibrary dl = libraryRepository
                .findByTableName(libraryId)
                .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: " + libraryId));

        if (authenticationFacade.isOrganizationAdmin()) {
            return new LibraryModel(dl, "OWNER");
        }

        Optional<String> oRole = permissionsRepository.getRoleForLibrary(libraryId);
        if (oRole.isPresent()) {
            return new LibraryModel(dl, oRole.get());
        } else {
            throw new ForbiddenException("Недостаточно прав для просмотра библиотеки: " + libraryId);
        }
    }

    public boolean isExist(ResourceQualifier rIdentifier) {
        return libraryRepository.existsByTableName(rIdentifier.getTable());
    }

    public SchemaDto getSchema(String docLibId) {
        return schemaService.getSchemaByName(getInfo(docLibId).getSchemaId())
                            .orElseThrow(() -> new NotFoundException("Не найдена схема библиотеки: " + docLibId));
    }

    public Page<FileResourceDto> getAllFilePathForAllLibraries(Pageable pageable) {
        List<FileResourceDto> filePaths = new ArrayList<>();

        List<DocumentLibrary> documentLibrariesWithSchemas =
                StreamSupport.stream(libraryRepository.findAll().spliterator(), false)
                             .filter(documentLibrary -> Objects.nonNull(documentLibrary.getSchemaId()))
                             .filter(documentLibrary -> Objects.nonNull(documentLibrary.getTableName()))
                             .filter(this::checkSchemaHasBinaryField)
                             .collect(Collectors.toList());

        for (DocumentLibrary documentLibrary: documentLibrariesWithSchemas) {
            List<String> contentTypes = new ArrayList<>();
            Optional<SchemaDto> schema = schemaService.getSchemaByName(documentLibrary.getSchemaId());
            if (schema.isPresent()) {
                contentTypes = schema.get()
                                     .getContentTypes()
                                     .stream().map(ContentTypes::getId)
                                     .collect(Collectors.toList());
            }

            String filter = "is_folder = false and content_type_id in (" + buildInSection(contentTypes) + ")";

            ResourceQualifier tableQualifier = new ResourceQualifier(documentLibrary.getTableName());

            List<IRecord> allRecordsByDocLibrary = recordsDao.findAll(tableQualifier, filter, schema.get());
            List<FileResourceDto> filePathsByLibrary = allRecordsByDocLibrary
                    .stream()
                    .filter(recordDto -> !recordDto.getContent().isEmpty())
                    .filter(this::checkInnerPathExist)
                    .map(recordDto -> mapWithDefaultPath(documentLibrary.getTitle(),
                                                         (String) recordDto.getContent().get("inner_path")))
                    .collect(Collectors.toList());

            filePaths.addAll(filePathsByLibrary);
        }

        int limit = (int) (pageable.getOffset() + pageable.getPageSize());
        List<FileResourceDto> page = filePaths.subList((int) pageable.getOffset(), limit);

        return new PageImpl<>(page, pageable, filePaths.size());
    }

    private boolean checkSchemaHasBinaryField(DocumentLibrary documentLibrary) {
        return schemaService.getSchemaByName(documentLibrary.getSchemaId())
                            .filter(schemaDto -> schemaDto.getProperties()
                                                          .stream()
                                                          .anyMatch(simplePropertyDto -> simplePropertyDto.getName()
                                                                                                          .equals("binary")))
                            .isPresent();
    }

    private FileResourceDto mapWithDefaultPath(String libraryName, String path) {
        String[] splitPathBySlash = path.split("/");
        if (splitPathBySlash.length < 2) {
            path = defaultPath + "/" + path;
        }

        return new FileResourceDto(libraryName, path);
    }

    private boolean checkInnerPathExist(IRecord recordDto) {
        return recordDto.getContent().containsKey("inner_path")
                && Objects.nonNull(recordDto.getContent().get("inner_path"));
    }
}
