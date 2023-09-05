package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.Territory;

/**
 * Модель данных Document - territory.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "territory", objectClass = Territory.class)
public class TerritoryMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("shape")
    private String location;
}
