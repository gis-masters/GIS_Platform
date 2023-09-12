package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.ProtectedNaturalAreas;

/**
 * Модель данных из protectednaturalareas.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "protectednaturalareas", objectClass = ProtectedNaturalAreas.class)
public class ProtectedNaturalAreasMixin {

    @JsonProperty("guid_protected_natural_areas")
    private String guid;

    @JsonProperty("objectname")
    private String objectName;

    @JsonProperty("area")
    private Double area;

}
