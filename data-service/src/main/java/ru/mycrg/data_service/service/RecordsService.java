package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.TablesDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.RecordDto;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.binary_analyzers.SimpleIntentIntentHandler;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;

@Service
public class RecordsService {

    private final Logger log = LoggerFactory.getLogger(RecordsService.class);

    private final TablesDao tablesDao;
    private final FileStorageService fileStorageService;
    private final DocumentLibraryService librariesService;
    private final SystemAttributeHandler systemAttributeHandler;
    private final BasePermissionsRepository permissionsRepository;
    private final PermissionsService permissionsService;
    private final SimpleIntentIntentHandler simpleIntentHandler;

    public RecordsService(TablesDao tablesDao,
                          FileStorageService fileStorageService,
                          DocumentLibraryService librariesService,
                          SystemAttributeHandler systemAttributeHandler,
                          BasePermissionsRepository permissionsRepository,
                          PermissionsService permissionsService,
                          SimpleIntentIntentHandler simpleIntentHandler) {
        this.tablesDao = tablesDao;
        this.fileStorageService = fileStorageService;
        this.librariesService = librariesService;
        this.systemAttributeHandler = systemAttributeHandler;
        this.permissionsRepository = permissionsRepository;
        this.permissionsService = permissionsService;
        this.simpleIntentHandler = simpleIntentHandler;
    }

    public Page<RecordDto> getPaged(ResourceQualifier lQualifier,
                                    Pageable pageable,
                                    Long parentId,
                                    String title) {
        final long total;
        final List<RecordDto> allowedResources;

        String path = ROOT_FOLDER_PATH;
        if (parentId != null) {
            final Map<String, Object> parent = tablesDao
                    .findById(lQualifier, parentId)
                    .orElseThrow(() -> new NotFoundException("Not found record by id: " + parentId));

            path = String.format("%s/%d", parent.get("path"), parentId);

            Set<String> ids = extractFolderIdsFromPath(path);

            boolean allowedByParentPermissions = permissionsRepository.isAllowedByParentsPermissions(lQualifier, ids);
            if (allowedByParentPermissions) {
                allowedResources = tablesDao.findAllByPath(lQualifier, path, title, pageable);
                total = tablesDao.getTotalByPath(lQualifier, path, title);
            } else {
                allowedResources = permissionsRepository.findAllowedByParent(lQualifier, path, title, pageable);
                total = permissionsRepository.getTotalByParent(lQualifier, path, title);
            }
        } else {
            allowedResources = permissionsRepository.findAllowedByParent(lQualifier, path, title, pageable);
            total = permissionsRepository.getTotalByParent(lQualifier, path, title);
        }

        return new PageImpl<>(allowedResources, pageable, total);
    }

    /**
     * Возвращает запись из библиотеки при наличии к ней доступа.
     *
     * @param lQualifier Квалификатор библиотеки
     * @param recordId   Идентификатор записи
     */
    public Map<String, Object> getById(ResourceQualifier lQualifier, Long recordId) {
        String definedRole = null;

        Map<String, Object> record = tablesDao.findById(lQualifier, recordId)
                                              .orElseThrow(() -> new NotFoundException(recordId));

        // Если запись имеет родителей - получим роль наследуемую от них
        String path = String.valueOf(record.get(PATH.getName()));
        if (path != null && !path.equals(ROOT_FOLDER_PATH)) {
            Set<String> ids = extractFolderIdsFromPath(path);

            Optional<String> oRole = permissionsRepository.bestRoleInheritedFromParent(lQualifier, ids);
            if (oRole.isPresent()) {
                definedRole = oRole.get();
            }
        }

        // Если роль на данном этапе максимальная, то дальше ничего делать не нужно.
        String ownerRole = "OWNER";
        if (ownerRole.equals(definedRole)) {
            record.put(ROLE.getName(), ownerRole);

            return record;
        }

        // Проверим роль выданную непосредственно на запись
        Optional<String> oRole = permissionsRepository.getRoleForRecord(lQualifier, recordId);
        if (oRole.isPresent()) {
            record.put(ROLE.getName(), oRole.get());
            definedRole = oRole.get();
        }

        // Если роль на данном этапе максимальная, то дальше ничего делать не нужно.
        if (ownerRole.equals(definedRole)) {
            record.put(ROLE.getName(), ownerRole);

            return record;
        }

        // Проверим доступна ли запись как "проходная папка", т.е. из-за наличия в ней элементов к которым есть доступ
        boolean isFolder = Boolean.parseBoolean(String.valueOf(record.get(IS_FOLDER.getName())));
        if (isFolder) {
            boolean isPassThroughFolder = permissionsRepository.isPassThroughFolder(lQualifier, path + "/" + recordId);
            if (isPassThroughFolder) {
                record.put(ROLE.getName(), "VIEWER");

                return record;
            }

            if (definedRole == null) {
                throw new ForbiddenException("Недостаточно прав для просмотра записи: " + recordId);
            } else {
                record.put(ROLE.getName(), definedRole);

                return record;
            }
        }

        if (definedRole == null) {
            throw new ForbiddenException("Недостаточно прав для просмотра записи: " + recordId);
        } else {
            record.put(ROLE.getName(), definedRole);

            return record;
        }
    }

    @Transactional
    public IRecord createRecord(ResourceQualifier tableQualifier,
                                RecordEntity record,
                                MultipartFile file) {
        try {
            log.debug("try create record: {}", record);

            SchemaDto schema = librariesService.getSchema(tableQualifier.getTable());

            systemAttributeHandler.initSchema(schema)
                                  .fillByContentType(record.getContent())
                                  .addDefaultPath(record.getContent())
                                  .fillCreator(record.getContent())
                                  .fillTimes(record.getContent());

            if (file != null) {
                if (file.isEmpty()) {
                    throw new BadRequestException("File is empty");
                }

                String innerFileName = generateFileName(file);
                systemAttributeHandler.initSchema(schema)
                                      .fillFileInfo(record.getContent(), file)
                                      .fillFileInnerName(record.getContent(), innerFileName);

                fileStorageService.storeFile(file, innerFileName);
            }

            simpleIntentHandler.updateIntents(record);
            IRecord newRecord = tablesDao.addRecord(tableQualifier, record);
            permissionsService.addOwnerPermission(tableQualifier, record.getId());

            return newRecord;
        } catch (CrgDaoException e) {
            throw new DataServiceException(e.getMessage(), e.getCause());
        }
    }

    /**
     * Update record.
     *
     * @param recordQualifier Идентификатор записи в библиотеке
     * @param payload         Данные для обновления
     */
    public void update(ResourceQualifier recordQualifier, Map<String, Object> payload) {
        try {
            log.debug("try update record: {} by data: {}", recordQualifier.getQualifier(), payload);

            ResourceQualifier tQualifier = new ResourceQualifier(recordQualifier.getSchema(),
                                                                 recordQualifier.getTable());
            Map<String, Object> record = getById(tQualifier, recordQualifier.getRecord());
            Map<String, Object> newData = clearSystemAttributes(payload);
            newData.put(LAST_MODIFIED.getName(), LocalDateTime.now().format(ISO_LOCAL_DATE_TIME).replace("T", " "));

            newData.forEach((key, value) -> record.put(key, newData.get(key)));

            tablesDao.updateRecordById(recordQualifier, newData);

            log.debug("successfully patched");
        } catch (Exception e) {
            throw new DataServiceException("Failed to update record: " + recordQualifier.getQualifier(), e.getCause());
        }
    }

    public void deleteRecord(ResourceQualifier resourceQualifier, Long id) throws CrgDaoException {
        tablesDao.removeRecord(resourceQualifier, id);
    }

    private Map<String, Object> clearSystemAttributes(Map<String, Object> patchedRecord) {
        Map<String, Object> result = new HashMap<>();
        patchedRecord.forEach((key, value) -> {
            if (!key.equals(ID.getName()) &&
                    !key.equals(PATH.getName()) &&
                    !key.equals(CREATED_AT.getName()) &&
                    !key.equals(LAST_MODIFIED.getName()) &&
                    !key.equals("is_folder")) {
                result.put(key, value);
            }
        });

        return result;
    }

    private Set<String> extractFolderIdsFromPath(String path) {
        final String[] splited = path.split("/root/");
        if (splited.length < 2) {
            return new HashSet<>();
        }

        return Arrays.stream(splited[1].split("/"))
                     .collect(Collectors.toSet());
    }

    @NotNull
    private String generateFileName(MultipartFile file) {
        return String.format("%s.%s",
                             UUID.randomUUID().toString().substring(0, 13),
                             StringUtils.getFilenameExtension(file.getOriginalFilename()));
    }
}
