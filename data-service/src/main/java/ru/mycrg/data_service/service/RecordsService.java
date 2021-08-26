package ru.mycrg.data_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.TablesDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.Record;
import ru.mycrg.data_service.entity.ITableObject;
import ru.mycrg.data_service.entity.TableObjectImpl;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecordsService {

    private final TablesDao tablesDao;
    private final FileStorageService fileStorageService;
    private final DocumentLibraryService librariesService;
    private final SystemAttributeHandler systemAttributeHandler;
    private final BasePermissionsRepository permissionsRepository;
    private final PermissionsService permissionsService;

    private final String SYSTEM_ROOT_FOLDER_PATH = "/root";

    public RecordsService(TablesDao tablesDao,
                          FileStorageService fileStorageService,
                          DocumentLibraryService librariesService,
                          SystemAttributeHandler systemAttributeHandler,
                          BasePermissionsRepository permissionsRepository,
                          PermissionsService permissionsService) {
        this.tablesDao = tablesDao;
        this.fileStorageService = fileStorageService;
        this.librariesService = librariesService;
        this.systemAttributeHandler = systemAttributeHandler;
        this.permissionsRepository = permissionsRepository;
        this.permissionsService = permissionsService;
    }

    public Page<Record> getPaged(ResourceQualifier libraryTable,
                                 Pageable pageable,
                                 Long parentId,
                                 String title) {
        final long total;
        final List<Record> allowedResources;

        String path = SYSTEM_ROOT_FOLDER_PATH;
        if (parentId != null) {
            final Map<String, Object> parent = tablesDao
                    .findById(libraryTable, parentId)
                    .orElseThrow(() -> new NotFoundException("Not found record by id: " + parentId));

            path = parent.get("path") + "/" + parentId;

            Set<String> ids = extractFolderIdsFromPath(path);

            boolean allowedByParentPermissions = permissionsRepository.isAllowedByParentsPermissions(libraryTable, ids);
            if (allowedByParentPermissions) {
                allowedResources = tablesDao.findAllByPath(libraryTable, path, title, pageable);
                total = tablesDao.getTotalByPath(libraryTable, path, title);
            } else {
                allowedResources = permissionsRepository.findAllowedByParent(libraryTable, path, title, pageable);
                total = permissionsRepository.getTotalByParent(libraryTable, path, title);
            }
        } else {
            allowedResources = permissionsRepository.findAllowedByParent(libraryTable, path, title, pageable);
            total = permissionsRepository.getTotalByParent(libraryTable, path, title);
        }

        return new PageImpl<>(allowedResources, pageable, total);
    }

    public Map<String, Object> getById(ResourceQualifier resourceQualifier, Long recordId) {
        return tablesDao.findById(resourceQualifier, recordId)
                        .orElseThrow(() -> new NotFoundException(recordId));
    }

    @Transactional
    public ITableObject createRecord(ResourceQualifier tableQualifier,
                                     Map<String, Object> body,
                                     MultipartFile file) {
        try {
            String innerFileName = UUID.randomUUID().toString();

            final SchemaDto schema = librariesService.getSchema(tableQualifier.getTable());

            systemAttributeHandler.initSchema(schema)
                                  .addDefaultPath(body)
                                  .fillTimes(body);

            if (file != null) {
                if (file.isEmpty()) {
                    throw new BadRequestException("File is empty");
                }

                systemAttributeHandler.initSchema(schema)
                                      .fillFileInfo(body, file)
                                      .fillFileInnerName(body, innerFileName);

                fileStorageService.storeFile(file, innerFileName);
            }

            final Long id = tablesDao.addRecord(tableQualifier, body);
            permissionsService.addOwnerPermission(tableQualifier, id);

            return new TableObjectImpl(id);
        } catch (CrgDaoException e) {
            throw new DataServiceException(e.getMessage(), e.getCause());
        }
    }

    public void deleteRecord(ResourceQualifier resourceQualifier, Long id) throws CrgDaoException {
        tablesDao.removeRecord(resourceQualifier, id);
    }

    private Set<String> extractFolderIdsFromPath(String path) {
        final String[] splited = path.split("/root/");
        if (splited.length < 2) {
            return new HashSet<>();
        }

        return Arrays.stream(splited[1].split("/"))
                     .collect(Collectors.toSet());
    }
}
