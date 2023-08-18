package ru.mycrg.data_service.service.records;

import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.SystemAttributeHandler;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.data_service_contract.dto.DocumentVersioningDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.*;

import static java.util.Objects.nonNull;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.dto.Roles.*;
import static ru.mycrg.data_service.util.EcqlFilterUtil.addAsEqual;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;

@Service
public class UserRecordsService implements IRecordsService {

    private final RecordsDao recordsDao;
    private final OwnerRecordsService ownerRecordsService;
    private final DocumentLibraryService librariesService;
    private final BasePermissionsRepository permissionsRepository;
    private final IMasterResourceProtector resourceProtector;
    private final SystemAttributeHandler systemAttributeHandler;

    public UserRecordsService(RecordsDao recordsDao,
                              OwnerRecordsService ownerRecordsService,
                              DocumentLibraryService librariesService,
                              BasePermissionsRepository permissionsRepository,
                              MasterResourceProtector resourceProtector,
                              SystemAttributeHandler systemAttributeHandler) {
        this.recordsDao = recordsDao;
        this.ownerRecordsService = ownerRecordsService;
        this.librariesService = librariesService;
        this.permissionsRepository = permissionsRepository;
        this.resourceProtector = resourceProtector;
        this.systemAttributeHandler = systemAttributeHandler;
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
            ecqlFilter = ecqlFilter.toLowerCase().contains(IS_DELETED.getName())
                    ? ecqlFilter
                    : addAsEqual(ecqlFilter, IS_DELETED.getName(), "false");

            Set<String> ids = systemAttributeHandler.extractFolderIdsFromPath(path);

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
            ecqlFilter = ecqlFilter.toLowerCase().contains(IS_DELETED.getName())
                    ? ecqlFilter
                    : addAsEqual(ecqlFilter, IS_DELETED.getName(), "false");

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

            String pathToMeAndChildren = MessageFormat.format("{0}/{1}/%", record.getContent().get(PATH.getName()), id);
            paths.add(pathToMeAndChildren);
        });

        ecqlFilter = ecqlFilter.toLowerCase().contains(IS_DELETED.getName())
                ? ecqlFilter
                : addAsEqual(ecqlFilter, IS_DELETED.getName(), "false");

        List<IRecord> allAllowedRecords = recordsDao.findAllowed(lQualifier, ids, paths, ecqlFilter, schema, pageable);
        long total = recordsDao.getTotalAllowed(lQualifier, ids, paths, ecqlFilter);

        return new PageImpl<>(allAllowedRecords, pageable, total);
    }

    @Override
    public IRecord getById(ResourceQualifier rQualifier, Object recordId) {
        SchemaDto schema = librariesService.getSchema(rQualifier.getTable());

        return getById(rQualifier, recordId, schema);
    }

    @Override
    public IRecord getById(ResourceQualifier rQualifier, Object recordId, SchemaDto schema) {
        String definedRole = null;

        // Создаю новый - переходное решение пока некоторые квалификаторы не включают в себя идентификатор записи
        ResourceQualifier recordQualifier = new ResourceQualifier(rQualifier, recordId, LIBRARY_RECORD);

        IRecord record = recordsDao.findById(recordQualifier, schema)
                                   .orElseThrow(() -> new NotFoundException(recordId));
        Map<String, Object> content = record.getContent();

        // Если запись имеет родителей - получим роль наследуемую от них
        String path = String.valueOf(content.get(PATH.getName()));
        if (path != null && !path.equals(ROOT_FOLDER_PATH)) {
            Set<String> ids = systemAttributeHandler.extractFolderIdsFromPath(path);

            Optional<String> oRole = permissionsRepository.bestRoleInheritedFromParent(rQualifier, ids);
            if (oRole.isPresent()) {
                definedRole = oRole.get();
            }
        }

        // Если роль на данном этапе максимальная, то дальше ничего делать не нужно.
        String ownerRole = "OWNER";
        String editorRole = "CONTRIBUTOR";
        if (ownerRole.equals(definedRole)) {
            content.put(ROLE.getName(), ownerRole);

            return record;
        }

        // Проверим роль выданную непосредственно на запись
        Optional<String> oRole = permissionsRepository.getBestRoleForRecord(recordQualifier);
        if (oRole.isPresent()) {
            if (nonNull(definedRole)) {
                if (isFirstRoleBetterThanSecond(oRole.get(), definedRole)) {
                    content.put(ROLE.getName(), oRole.get());
                    definedRole = oRole.get();
                }
            } else {
                content.put(ROLE.getName(), oRole.get());
                definedRole = oRole.get();
            }
        }

        // Если роль на данном этапе максимальная, то дальше ничего делать не нужно.
        if (ownerRole.equals(definedRole)) {
            content.put(ROLE.getName(), ownerRole);

            return record;
        }

        // Если роль на данном этапе CONTRIBUTOR, то нет смысла копать дальше поскольку роль как для проходной папки
        // может быть только VIEWER что "слабее" CONTRIBUTOR
        if (editorRole.equals(definedRole)) {
            content.put(ROLE.getName(), editorRole);

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
    public List<DocumentVersioningDto> getVersionsByRecordId(ResourceQualifier rQualifier, Object recordId) {
        IRecord record = getById(rQualifier, recordId);
        String versions = record.getAsString(VERSIONS.getName());
        if (record.isFolder() || !nonNull(versions)) {
            return new ArrayList<>();
        }

        try {
            return mapper.readValue(versions, new TypeReference<List<DocumentVersioningDto>>() {
            });
        } catch (IOException e) {
            throw new DataServiceException("Не удалось получить версии документа: " + rQualifier);
        }
    }

    @Override
    @Transactional
    public IRecord createRecord(ResourceQualifier lQualifier,
                                IRecord record,
                                SchemaDto schema) {
        throwIfCreateNotAllowed(lQualifier, record);

        return ownerRecordsService.createRecord(lQualifier, record, schema);
    }

    @Override
    public void updateRecord(ResourceQualifier rQualifier, IRecord record, SchemaDto schema) {
        throwIfUpdateNotAllowed(rQualifier, record); // возможно стоит перенести на уровень handler-а

        ownerRecordsService.updateRecord(rQualifier, record, schema);
    }

    @Override
    public void deleteRecord(ResourceQualifier rQualifier, Long id) throws CrgDaoException {
        throwIfDeleteNotAllowed(rQualifier);

        ownerRecordsService.deleteRecord(rQualifier, id);
    }

    private void throwIfCreateNotAllowed(ResourceQualifier lQualifier, IRecord record) {
        boolean libraryEditAllowed = true;
        boolean folderEditAllowed = true;
        boolean inFolder = false;
        Long lastFolderId = null;

        if (!resourceProtector.isEditAllowed(lQualifier)) {
            libraryEditAllowed = false;
        }

        String path = record.getAsString(PATH.getName());
        if (path != null && !ROOT_FOLDER_PATH.equals(path)) {
            Optional<Long> oLastFolderId = systemAttributeHandler.getLastIdFromPath(path);
            if (oLastFolderId.isEmpty()) {
                throw new BadRequestException("Задан некорректный путь: " + path);
            } else {
                lastFolderId = oLastFolderId.get();
                inFolder = true;

                IRecord parentRecord = this.getById(lQualifier, lastFolderId);
                String role = parentRecord.getAsString(ROLE.getName());
                if (VIEWER.name().equals(role)) {
                    folderEditAllowed = false;
                }
            }
        }

        if (!libraryEditAllowed) { // Библиотека НЕ доступна для редактирования
            if (inFolder) { // Создаём в папке
                if (folderEditAllowed) {
                    // Разрешено в доступной на редактирование папке в недоступной для редактирования библиотеке
                    return;
                }

                throw new ForbiddenException("Папка: " + lastFolderId + " не доступна для записи.");
            } else {
                // Запрещено создавать в корне
                throw new ForbiddenException("Библиотека: '" + lQualifier + "' не доступна для записи.");
            }
        } else { // Библиотека доступна для редактирования
            if (inFolder) { // Создаём в папке
                if (folderEditAllowed) {
                    // Разрешено создавать в доступной папке
                    return;
                }

                // Запрещено создавать в папках недоступных на редактирование
                throw new ForbiddenException("Папка: " + lastFolderId + " не доступна для записи.");
            }
            // Разрешено создавать в корне
        }
    }

    private void throwIfUpdateNotAllowed(ResourceQualifier lQualifier, IRecord record) {
        if (!resourceProtector.isEditAllowed(lQualifier)) {
            throw new ForbiddenException("Библиотека: '" + lQualifier + "' не доступна для обновления.");
        }

        String path = record.getAsString(PATH.getName());
        if (path != null && !ROOT_FOLDER_PATH.equals(path)) {
            Optional<Long> oLastFolderId = systemAttributeHandler.getLastIdFromPath(path);
            if (oLastFolderId.isEmpty()) {
                throw new BadRequestException("Задан некорректный путь: " + path);
            } else {
                Long lastFolderId = oLastFolderId.get();

                IRecord parentRecord = this.getById(lQualifier, lastFolderId);
                String role = parentRecord.getAsString(ROLE.getName());
                if (VIEWER.name().equals(role)) {
                    String msg = "Папка: " + lastFolderId + " не доступна для обновления.";

                    throw new ForbiddenException(msg);
                }
            }
        }
    }

    private void throwIfDeleteNotAllowed(ResourceQualifier rQualifier) {
        if (!resourceProtector.isEditAllowed(rQualifier)) {
            String msg = "Библиотека: '" + rQualifier.getQualifier() + "' не доступна для удаления.";

            throw new ForbiddenException(msg);
        }
    }

    private boolean isFirstRoleBetterThanSecond(String recordRole, String defineRole) {
        Map<String, Integer> roleWeights = new HashMap<>();
        roleWeights.put(VIEWER.name(), 10);
        roleWeights.put(CONTRIBUTOR.name(), 20);
        roleWeights.put(OWNER.name(), 30);

        Integer firstRoleWeight = roleWeights.get(recordRole);
        Integer secondRoleWeight = roleWeights.get(defineRole);

        return firstRoleWeight > secondRoleWeight;
    }
}
