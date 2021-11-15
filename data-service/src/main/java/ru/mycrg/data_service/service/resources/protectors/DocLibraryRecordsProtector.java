package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.ResourceType.RECORD;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

@Component
public class DocLibraryRecordsProtector implements IResourceProtector {

    private final RecordsDao recordsDao;
    private final IAuthenticationFacade authenticationFacade;
    private final DocumentLibraryService documentLibraryService;
    private final BasePermissionsRepository permissionsRepository;

    public DocLibraryRecordsProtector(RecordsDao recordsDao,
                                      IAuthenticationFacade authenticationFacade,
                                      DocumentLibraryService documentLibraryService,
                                      BasePermissionsRepository permissionsRepository) {
        this.recordsDao = recordsDao;
        this.authenticationFacade = authenticationFacade;
        this.documentLibraryService = documentLibraryService;
        this.permissionsRepository = permissionsRepository;
    }

    @Override
    public void throwIfNotExist(@NotNull ResourceQualifier recordQualifier) {
        if (!documentLibraryService.isExist(recordQualifier)) {
            throw new NotFoundException(recordQualifier.getQualifier());
        }
    }

    @Override
    public void throwIfExists(@NotNull ResourceQualifier recordQualifier) {
        if (documentLibraryService.isExist(recordQualifier)) {
            throw new ConflictException("Запись " + recordQualifier + " уже существует");
        }
    }

    @Override
    public boolean isOwner(ResourceQualifier recordQualifier) {
        return authenticationFacade.isOrganizationAdmin()
                || isUserHasOwnPermission(recordQualifier)
                || authenticationFacade.isRoot();
    }

    @Override
    public ResourceType getType() {
        return RECORD;
    }

    /**
     * Для записи в библиотеке проверим наследование сверху и права на саму запись. Наследование снизу может дать
     * только права на чтение
     */
    private boolean isUserHasOwnPermission(ResourceQualifier recordQualifier) {
        Map<String, Object> record = recordsDao.findById(recordQualifier)
                                               .orElseThrow(() -> new NotFoundException(recordQualifier.getRecord()));

        // Если запись имеет родителей - получим роль наследуемую от них
        String path = String.valueOf(record.get(PATH.getName()));
        if (path != null && !path.equals(ROOT_FOLDER_PATH)) {
            Set<String> ids = extractFolderIdsFromPath(path);

            Optional<String> oRole = permissionsRepository.bestRoleInheritedFromParent(recordQualifier, ids);
            if (oRole.isPresent() && Objects.equals(OWNER.name(), oRole.get())) {
                return true;
            }
        }

        // Проверим роль выданную непосредственно на запись
        Optional<String> oRole = permissionsRepository.getRoleForRecord(recordQualifier);
        if (oRole.isPresent() && Objects.equals(OWNER.name(), oRole.get())) {
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
