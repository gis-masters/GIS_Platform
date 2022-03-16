package ru.mycrg.data_service.service.records;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.SystemAttributeHandler;
import ru.mycrg.data_service.service.binary_analyzers.SimpleIntentHandler;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.text.MessageFormat;
import java.util.*;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.service.records.RecordUtil.clearSystemAttributes;
import static ru.mycrg.data_service.service.records.RecordUtil.extractFolderIdsFromPath;
import static ru.mycrg.data_service.util.EcqlFilterUtil.addAsEqual;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;

@Service
public class UserRecordsService implements IRecordsService {

    private final Logger log = LoggerFactory.getLogger(UserRecordsService.class);

    private final RecordsDao recordsDao;
    private final FileStorageService fileStorageService;
    private final DocumentLibraryService librariesService;
    private final SystemAttributeHandler systemAttributeHandler;
    private final BasePermissionsRepository permissionsRepository;
    private final PermissionsService permissionsService;
    private final SimpleIntentHandler simpleIntentHandler;

    public UserRecordsService(RecordsDao recordsDao,
                              FileStorageService fileStorageService,
                              DocumentLibraryService librariesService,
                              SystemAttributeHandler systemAttributeHandler,
                              BasePermissionsRepository permissionsRepository,
                              PermissionsService permissionsService,
                              SimpleIntentHandler simpleIntentHandler) {
        this.recordsDao = recordsDao;
        this.librariesService = librariesService;
        this.fileStorageService = fileStorageService;
        this.systemAttributeHandler = systemAttributeHandler;
        this.permissionsRepository = permissionsRepository;
        this.permissionsService = permissionsService;
        this.simpleIntentHandler = simpleIntentHandler;
    }

    @Override
    public Page<IRecord> getPaged(ResourceQualifier lQualifier,
                                  Pageable pageable,
                                  Long parentId,
                                  String ecqlFilter) {
        String path = ROOT_FOLDER_PATH;
        SchemaDto schema = librariesService.getSchema(lQualifier.getTable());

        long total;
        List<IRecord> records;
        if (parentId != null) {
            ResourceQualifier recordQualifier = new ResourceQualifier(lQualifier, parentId, LIBRARY_RECORD);
            IRecord parent = recordsDao.findById(recordQualifier, schema)
                                       .orElseThrow(() -> new NotFoundException("Запись не найдена: " + parentId));

            path = String.format("%s/%d", parent.getContent().get("path"), parentId);
            ecqlFilter = addAsEqual(ecqlFilter, PATH.getName(), path);

            Set<String> ids = extractFolderIdsFromPath(path);

            boolean allowedByParentPermissions = permissionsRepository.isAllowedByParentsPermissions(lQualifier, ids);
            if (allowedByParentPermissions) {
                records = recordsDao.findAll(lQualifier, ecqlFilter, schema, pageable);
                total = recordsDao.getTotal(lQualifier, ecqlFilter);
            } else {
                records = permissionsRepository.findAllowedByParent(lQualifier, path, ecqlFilter, schema, pageable);
                total = permissionsRepository.getTotalByParent(lQualifier, path, ecqlFilter);
            }
        } else {
            ecqlFilter = addAsEqual(ecqlFilter, PATH.getName(), path);

            records = permissionsRepository.findAllowedByParent(lQualifier, path, ecqlFilter, schema, pageable);
            total = permissionsRepository.getTotalByParent(lQualifier, path, ecqlFilter);
        }

        return new PageImpl<>(records, pageable, total);
    }

    @Override
    public Page<IRecord> getAsRegistry(ResourceQualifier lQualifier, Pageable pageable, String ecqlFilter) {
        SchemaDto schema = librariesService.getSchema(lQualifier.getTable());
        List<IRecord> allowedDirectly = permissionsRepository.findAllowedDirectly(lQualifier, schema);
        Set<String> ids = new HashSet<>();
        Set<String> paths = new HashSet<>();
        allowedDirectly.forEach(record -> {
            String id = String.valueOf(record.getContent().get(ID.getName()));
            ids.add(id);

            String pathToMeAndChildren = MessageFormat.format("{0}/{1}%", record.getContent().get(PATH.getName()), id);
            paths.add(pathToMeAndChildren);
        });

        List<IRecord> allAllowedRecords = recordsDao.findAllowed(lQualifier, ids, paths, ecqlFilter, schema, pageable);
        long total = recordsDao.getTotalAllowed(lQualifier, ids, paths, ecqlFilter);

        return new PageImpl<>(allAllowedRecords, pageable, total);
    }

    @Override
    public IRecord getById(ResourceQualifier rQualifier, Long recordId) {
        String definedRole = null;

        // Создаю новый - переходное решение пока некоторые квалификаторы не включают в себя идентификатор записи
        ResourceQualifier recordQualifier = new ResourceQualifier(rQualifier, recordId, LIBRARY_RECORD);

        SchemaDto schema = librariesService.getSchema(rQualifier.getTable());
        IRecord record = recordsDao.findById(recordQualifier, schema)
                                   .orElseThrow(() -> new NotFoundException(recordId));
        Map<String, Object> content = record.getContent();

        // Если запись имеет родителей - получим роль наследуемую от них
        String path = String.valueOf(content.get(PATH.getName()));
        if (path != null && !path.equals(ROOT_FOLDER_PATH)) {
            Set<String> ids = extractFolderIdsFromPath(path);

            Optional<String> oRole = permissionsRepository.bestRoleInheritedFromParent(rQualifier, ids);
            if (oRole.isPresent()) {
                definedRole = oRole.get();
            }
        }

        // Если роль на данном этапе максимальная, то дальше ничего делать не нужно.
        String ownerRole = "OWNER";
        if (ownerRole.equals(definedRole)) {
            content.put(ROLE.getName(), ownerRole);

            return record;
        }

        // Проверим роль выданную непосредственно на запись
        Optional<String> oRole = permissionsRepository.getRoleForRecord(recordQualifier);
        if (oRole.isPresent()) {
            content.put(ROLE.getName(), oRole.get());
            definedRole = oRole.get();
        }

        // Если роль на данном этапе максимальная, то дальше ничего делать не нужно.
        if (ownerRole.equals(definedRole)) {
            content.put(ROLE.getName(), ownerRole);

            return record;
        }

        // Проверим доступна ли запись как "проходная папка", т.е. из-за наличия в ней элементов к которым есть доступ
        boolean isFolder = Boolean.parseBoolean(String.valueOf(content.get(IS_FOLDER.getName())));
        if (isFolder) {
            boolean isPassThroughFolder = permissionsRepository.isPassThroughFolder(rQualifier, path + "/" + recordId);
            if (isPassThroughFolder) {
                content.put(ROLE.getName(), "VIEWER");

                return record;
            }

            if (definedRole == null) {
                throw new ForbiddenException("Недостаточно прав для просмотра записи: " + recordId);
            } else {
                content.put(ROLE.getName(), definedRole);

                return record;
            }
        }

        if (definedRole == null) {
            throw new ForbiddenException("Недостаточно прав для просмотра записи: " + recordId);
        } else {
            content.put(ROLE.getName(), definedRole);

            return record;
        }
    }

    @Override
    @Transactional
    public IRecord createRecord(ResourceQualifier lQualifier,
                                IRecord record,
                                MultipartFile file) {
        try {
            log.debug("try create record: {}", record);

            SchemaDto schema = librariesService.getSchema(lQualifier.getTable());

            systemAttributeHandler.initSchema(schema)
                                  .fillByContentType(record.getContent())
                                  .addDefaultPath(record.getContent())
                                  .fillCreator(record.getContent())
                                  .updateModifiedTime(record)
                                  .prepareJsonb(record);

            if (file != null) {
                if (file.isEmpty()) {
                    throw new BadRequestException("File is empty");
                }

                String path = fileStorageService.storeFile(file, fileStorageService.generateFileName(file));

                systemAttributeHandler.initSchema(schema)
                                      .fillFileInfo(record.getContent(), file)
                                      .fillFileInnerPath(record.getContent(), path);
            }

            simpleIntentHandler.updateIntents(record);
            IRecord newRecord = recordsDao.addRecord(lQualifier, record);
            permissionsService.addOwnerPermission(lQualifier, record.getId());

            return newRecord;
        } catch (CrgDaoException e) {
            throw new DataServiceException(e.getMessage(), e.getCause());
        }
    }

    // Есть некий confusing пока идёт переход от сервисов к cqrs и его обработчикам команд.
    // По-идее всё должно переехать в обработчики.
    @Override
    public void updateRecord(ResourceQualifier recordQualifier, IRecord record) {
        try {
            log.debug("try update record: {} by data: {}", recordQualifier.getQualifier(), record);

            Map<String, Object> clearedData = clearSystemAttributes(record);

            recordsDao.updateRecordById(recordQualifier, clearedData);

            log.debug("Record: '{}' successfully patched", recordQualifier.getRecord());
        } catch (Exception e) {
            throw new DataServiceException("Failed to update record: " + recordQualifier.getQualifier(), e.getCause());
        }
    }

    @Override
    public void deleteRecord(ResourceQualifier resourceQualifier, Long id) throws CrgDaoException {
        recordsDao.removeRecord(resourceQualifier, id);
    }
}
