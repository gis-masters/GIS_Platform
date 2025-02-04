package ru.mycrg.data_service.dao.utils;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import static ru.mycrg.data_service.dao.config.DaoProperties.ID;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.dto.ResourceType.FEATURE;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

public class ResourceQualifierUtil {

    @NotNull
    public static String getIdField(ResourceQualifier qualifier) {
        if (TABLE.equals(qualifier.getType()) || FEATURE.equals(qualifier.getType())) {
            return PRIMARY_KEY;
        } else {
            return ID;
        }
    }
}
