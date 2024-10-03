package ru.mycrg.data_service.service.document_library;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.DocumentLibraryDao;
import ru.mycrg.data_service.dao.mappers.DocLibraryMapper;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.RegistryData;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.service.gisogd.GisogdData;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.ID;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

@Service
public class DocumentLibraryService {

    public static final ResourceQualifier DL_QUALIFIER = libraryQualifier("doc_libraries");

    private final DocumentLibraryDao libraryDao;
    private final IAuthenticationFacade authenticationFacade;
    private final DocumentLibraryRepository libraryRepository;
    private final BasePermissionsRepository permissionsRepository;

    public DocumentLibraryService(DocumentLibraryDao libraryDao,
                                  IAuthenticationFacade authenticationFacade,
                                  DocumentLibraryRepository libraryRepository,
                                  BasePermissionsRepository permissionsRepository) {
        this.libraryDao = libraryDao;
        this.libraryRepository = libraryRepository;
        this.authenticationFacade = authenticationFacade;
        this.permissionsRepository = permissionsRepository;
    }

    public Page<LibraryModel> getPaged(String ecqlFilter, Pageable pageable) {
        long totalLibraries;

        List<LibraryModel> libraries;
        if (authenticationFacade.isOrganizationAdmin()) {
            libraries = libraryDao.findAll(ecqlFilter, pageable).stream()
                                  .map(LibraryModel::new)
                                  .collect(Collectors.toList());

            totalLibraries = libraryDao.getTotal(ecqlFilter);
        } else {
            libraries = permissionsRepository
                    .findAllowedByParent(DL_QUALIFIER, ROOT_FOLDER_PATH, ecqlFilter, pageable, new DocLibraryMapper())
                    .stream()
                    .map(LibraryModel::new)
                    .collect(Collectors.toList());

            totalLibraries = permissionsRepository.getTotalByParent(DL_QUALIFIER, ROOT_FOLDER_PATH, ecqlFilter);
        }

        return new PageImpl<>(libraries, pageable, totalLibraries);
    }

    public List<LibraryModel> getAll(String ecqlFilter) {
        List<LibraryModel> allAllowedLibraries;
        if (authenticationFacade.isOrganizationAdmin()) {
            allAllowedLibraries = libraryDao.findAll(ecqlFilter).stream()
                                            .map(LibraryModel::new)
                                            .collect(Collectors.toList());
        } else {
            allAllowedLibraries = permissionsRepository
                    .findAllowedByParent(DL_QUALIFIER,
                                         ROOT_FOLDER_PATH,
                                         ecqlFilter)
                    .stream()
                    .map(LibraryModel::new)
                    .collect(Collectors.toList());
        }

        return allAllowedLibraries;
    }

    /**
     * Increment registry number.
     *
     * @param libraryId Library identifier
     *
     * @return Old registry number.
     */
    @Transactional
    public Long incrementRegistryNumber(String libraryId) {
        DocumentLibrary library = libraryRepository
                .findByTableName(libraryId)
                .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: " + libraryId));

        Long oldRegistryNumber = library.getRegistryCounter();
        library.setRegistryCounter(oldRegistryNumber == null ? 1 : ++oldRegistryNumber);
        library.setLastModified(now());

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

        Optional<String> oRole = permissionsRepository.getBestRoleForLibrary(libraryId);
        if (oRole.isEmpty()) {
            throw new ForbiddenException("Недостаточно прав для просмотра библиотеки: " + libraryId);
        }

        return new LibraryModel(dl, oRole.get());
    }

    public boolean isExist(ResourceQualifier rIdentifier) {
        return libraryRepository.existsByTableName(rIdentifier.getTable());
    }

    public SchemaDto getSchema(String docLibId) {
        IResourceModel library = getInfo(docLibId);
        if (library.getSchema() == null) {
            throw new NotFoundException("Не найдена схема библиотеки: " + docLibId);
        }

        return library.getSchema();
    }

    public List<GisogdData> getLibrariesCreatedBySchema(String schemaId) {
        return libraryRepository.findBySchemaId(schemaId).stream()
                                .map(dl -> new GisogdData(
                                        new ResourceQualifier(SYSTEM_SCHEMA_NAME, dl.getTableName(), LIBRARY),
                                        dl.getGisogdRfPublicationOrder()))
                                .collect(Collectors.toList());
    }

    public RegistryData prepareDataForRegistry(ResourceQualifier lQualifier) {
        RegistryData registryData = new RegistryData();

        permissionsRepository.findAllowedDirectly(lQualifier).forEach(record -> {
            String id = String.valueOf(record.getAsString(ID.getName()));
            registryData.addId(id);

            if (record.isFolder()) {
                String path = record.getAsString(PATH.getName());
                registryData.addPaths(path, id);
            }
        });

        return registryData;
    }
}
