package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.UtilityConnectionPoint;

/**
 * Модель данных из tasks utility_connection_point.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "utility_connection_point", objectClass = UtilityConnectionPoint.class)
public class UtilityConnectionPointMixin {

    @JsonProperty("guid_utility_connection_point")
    private String guid;
    @JsonProperty("class")
    private String propertyClass;
    @JsonProperty("object_name")
    private String objectName;
    @ReverseMapping("file")
    private String dataSource;

}
