package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.dto.Roles.CONTRIBUTOR;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

@Component
public class DocLibraryRecordsProtector implements IResourceProtector {

    private final RecordsDao recordsDao;
    private final DocumentLibraryService librariesService;
    private final IAuthenticationFacade authenticationFacade;
    private final BasePermissionsRepository permissionsRepository;

    public DocLibraryRecordsProtector(RecordsDao recordsDao,
                                      DocumentLibraryService librariesService,
                                      IAuthenticationFacade authenticationFacade,
                                      BasePermissionsRepository permissionsRepository) {
        this.recordsDao = recordsDao;
        this.librariesService = librariesService;
        this.authenticationFacade = authenticationFacade;
        this.permissionsRepository = permissionsRepository;
    }

    @Override
    public void throwIfNotExist(@NotNull ResourceQualifier recordQualifier) {
        SchemaDto schema = librariesService.getSchema(recordQualifier.getTable());
        Optional<IRecord> oRecord = recordsDao.findById(recordQualifier, schema);
        if (oRecord.isEmpty()) {
            throw new NotFoundException(recordQualifier.getQualifier());
        }
    }

    @Override
    public void throwIfExists(@NotNull ResourceQualifier recordQualifier) {
        SchemaDto schema = librariesService.getSchema(recordQualifier.getTable());
        recordsDao.findById(recordQualifier, schema)
                  .ifPresent(stringObjectMap -> {
                      throw new ConflictException("Запись " + recordQualifier + " уже существует");
                  });
    }

    @Override
    public boolean isOwner(ResourceQualifier recordQualifier) {
        return authenticationFacade.isOrganizationAdmin()
                || isUserHasOwnPermission(recordQualifier)
                || authenticationFacade.isRoot();
    }

    @Override
    public boolean isAllowed(ResourceQualifier recordQualifier) {
        if (authenticationFacade.isOrganizationAdmin() || authenticationFacade.isRoot()) {
            return true;
        }

        SchemaDto schema = librariesService.getSchema(recordQualifier.getTable());
        IRecord record = recordsDao.findById(recordQualifier, schema)
                                   .orElseThrow(() -> new NotFoundException(recordQualifier.getRecordIdAsLong()));

        // Если запись имеет родителей - получим роль наследуемую от них
        String path = String.valueOf(record.getContent().get(PATH.getName()));
        if (path != null && !path.equals(ROOT_FOLDER_PATH)) {
            Set<String> ids = extractFolderIdsFromPath(path);

            Optional<String> roleFromParent = permissionsRepository.bestRoleInheritedFromParent(recordQualifier, ids);
            if (roleFromParent.isPresent()) {
                return true;
            }
        }

        // Проверим роль выданную непосредственно на запись
        return permissionsRepository.getBestRoleForRecord(recordQualifier)
                                    .isPresent();
    }

    @Override
    public boolean isEditAllowed(ResourceQualifier qualifier) {
        return authenticationFacade.isOrganizationAdmin()
                || isUserHasEditPermission(qualifier)
                || authenticationFacade.isRoot();
    }

    @Override
    public ResourceType getType() {
        return LIBRARY_RECORD;
    }

    /**
     * Для записи в библиотеке проверим наследование сверху и права на саму запись. Наследование снизу может дать только
     * права на чтение
     */
    private boolean isUserHasOwnPermission(ResourceQualifier rQualifier) {
        SchemaDto schema = librariesService.getSchema(rQualifier.getTable());
        IRecord record = recordsDao.findById(rQualifier, schema)
                                   .orElseThrow(() -> new NotFoundException(rQualifier.getRecordIdAsLong()));

        // Если запись имеет родителей - получим роль наследуемую от них
        String path = String.valueOf(record.getContent().get(PATH.getName()));
        if (path != null && !path.equals(ROOT_FOLDER_PATH)) {
            Set<String> ids = extractFolderIdsFromPath(path);

            Optional<String> oRole = permissionsRepository.bestRoleInheritedFromParent(rQualifier, ids);
            if (oRole.isPresent() && OWNER.name().equals(oRole.get())) {
                return true;
            }
        }

        // Проверим роль выданную непосредственно на запись
        Optional<String> oRole = permissionsRepository.getBestRoleForRecord(rQualifier);
        if (oRole.isPresent() && OWNER.name().equals(oRole.get())) {
            return true;
        }

        return false;
    }

    private boolean isUserHasEditPermission(ResourceQualifier rQualifier) {
        SchemaDto schema = librariesService.getSchema(rQualifier.getTable());
        IRecord record = recordsDao.findById(rQualifier, schema)
                                   .orElseThrow(() -> new NotFoundException(rQualifier.getRecordIdAsLong()));

        // Если запись имеет родителей - получим роль наследуемую от них
        String path = String.valueOf(record.getContent().get(PATH.getName()));
        if (path != null && !path.equals(ROOT_FOLDER_PATH)) {
            Set<String> ids = extractFolderIdsFromPath(path);

            Optional<String> oRole = permissionsRepository.bestRoleInheritedFromParent(rQualifier, ids);
            if (oRole.isPresent() && (OWNER.name().equals(oRole.get()) || CONTRIBUTOR.name().equals(oRole.get()))) {
                return true;
            }
        }

        // Проверим роль выданную непосредственно на запись
        Optional<String> oRole = permissionsRepository.getBestRoleForRecord(rQualifier);
        if (oRole.isPresent() &&
                (OWNER.name().equals(oRole.get()) || CONTRIBUTOR.name().equals(oRole.get()))) {
            return true;
        }

        return false;
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
