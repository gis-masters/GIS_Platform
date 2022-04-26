package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

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

    @Override
    public ResourceType getType() {
        return FEATURE;
    }
}
