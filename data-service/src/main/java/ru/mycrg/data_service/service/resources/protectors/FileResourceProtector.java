package ru.mycrg.data_service.service.resources.protectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import tools.jackson.databind.JsonNode;

import java.util.Optional;

import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.http_client.JsonConverter.fromJson;

@Component
public class FileResourceProtector implements IFileResourceProtector {

    private final Logger log = LoggerFactory.getLogger(FileResourceProtector.class);

    private final IAuthenticationFacade authenticationFacade;
    private final IMasterResourceProtector masterResourceProtector;

    public FileResourceProtector(IAuthenticationFacade authenticationFacade,
                                 MasterResourceProtector masterResourceProtector) {
        this.authenticationFacade = authenticationFacade;
        this.masterResourceProtector = masterResourceProtector;
    }

    @Override
    public boolean isOwner(File file) {
        if (hasPrivilegedAccess(file)) {
            return true;
        }

        return getFileResourceQualifier(file)
                .filter(masterResourceProtector::isOwner)
                .isPresent();
    }

    @Override
    public boolean isAllowed(File file) {
        if (hasPrivilegedAccess(file)) {
            return true;
        }

        return getFileResourceQualifier(file)
                .filter(masterResourceProtector::isAllowed)
                .isPresent();
    }

    @Override
    public boolean isEditAllowed(File file) {
        if (hasPrivilegedAccess(file)) {
            return true;
        }

        return getFileResourceQualifier(file)
                .filter(masterResourceProtector::isEditAllowed)
                .isPresent();
    }

    /**
     * Проверяет, имеет ли текущий пользователь привилегированный доступ к файлу.
     * <p>
     * Привилегированный доступ имеют: Администратор системы, Владелец организации, Создатель файла
     *
     * @param file файл для проверки
     *
     * @return true, если пользователь имеет привилегированный доступ
     */
    private boolean hasPrivilegedAccess(File file) {
        if (authenticationFacade.isRoot() || authenticationFacade.isOrganizationAdmin()) {
            return true;
        }

        // Создатель файла всегда имеет доступ к своему файлу
        return authenticationFacade.getLogin().equalsIgnoreCase(file.getCreatedBy());
    }

    /**
     * Файлы у нас не висят в воздухе, а должны быть привязаны или к записи библиотеки или к записи слоя.
     *
     * @param file entity файла
     *
     * @return ResourceQualifier той сущности к которой привязан файл.
     */
    private Optional<ResourceQualifier> getFileResourceQualifier(File file) {
        if (file == null) {
            return Optional.empty();
        }

        String resourceType = file.getResourceType();
        JsonNode resourceQualifier = file.getResourceQualifier();
        if (resourceType == null || resourceQualifier == null) {
            log.warn("Для файла '{}' Ресурс не указан", file.getId());

            return Optional.empty();
        }

        try {
            Optional<FileResourceQualifier> oFrQualifier = fromJson(resourceQualifier.toString(),
                                                                    FileResourceQualifier.class);

            FileResourceQualifier frQualifier =
                    oFrQualifier.orElseThrow(() -> new IllegalArgumentException(resourceType));

            return Optional.of(
                    new ResourceQualifier(frQualifier.getSchema(),
                                          frQualifier.getTable(),
                                          frQualifier.getRecordId(),
                                          ResourceType.valueOf(resourceType)));
        } catch (Exception e) {
            String msg = "Некорректно сформирован квалификатор ресурса";
            logError(msg, e);

            return Optional.empty();
        }
    }
}
