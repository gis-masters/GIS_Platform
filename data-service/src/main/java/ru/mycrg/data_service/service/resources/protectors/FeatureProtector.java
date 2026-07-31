package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import static ru.mycrg.data_service.dto.ResourceType.FEATURE;

@Component
public class FeatureProtector implements IResourceProtector {

    private final TableProtector tableProtector;
    private final SpatialRecordsDao spatialRecordsDao;

    public FeatureProtector(TableProtector tableProtector,
                            SpatialRecordsDao spatialRecordsDao) {
        this.tableProtector = tableProtector;
        this.spatialRecordsDao = spatialRecordsDao;
    }

    @Override
    public void throwIfNotExist(@NotNull ResourceQualifier fQualifier) {
        if (!spatialRecordsDao.isExist(fQualifier)) {
            throw new NotFoundException(fQualifier.getQualifier());
        }
    }

    @Override
    public void throwIfExists(@NotNull ResourceQualifier fQualifier) {
        if (spatialRecordsDao.isExist(fQualifier)) {
            throw new ConflictException("Фича " + fQualifier + " уже существует");
        }
    }

    @Override
    public boolean isOwner(ResourceQualifier fQualifier) {
        return tableProtector.isOwner(fQualifier);
    }

    @Override
    public boolean isAllowed(ResourceQualifier fQualifier) {
        return tableProtector.isAllowed(fQualifier);
    }

    @Override
    public boolean isEditAllowed(ResourceQualifier qualifier) {
        return tableProtector.isEditAllowed(qualifier);
    }

    public void throwIsEditNotAllowed(ResourceQualifier qualifier, SchemaDto schema) {
        if (!isEditAllowed(qualifier)) {
            throw new ForbiddenException(
                    "Таблица: '" + qualifier.getTableQualifier() + "' не доступна для обновления.");
        }

        if (schema.isReadOnly()) {
            throw new ForbiddenException(
                    "Таблица: '" + qualifier.getTableQualifier() + "' не доступна для редактирования.");
        }
    }

    @Override
    public ResourceType getType() {
        return FEATURE;
    }
}
