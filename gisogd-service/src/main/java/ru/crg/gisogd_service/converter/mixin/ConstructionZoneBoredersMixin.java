package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.ConstructionZonesBorders;

/**
 * Модель данных  construction_zones_borders.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "construction_zones_borders", objectClass = ConstructionZonesBorders.class)
public class ConstructionZoneBoredersMixin {

    @JsonProperty("guid_construction_zones_borders")
    private String guid;
    @JsonProperty("name")
    private String name;
    @JsonProperty("area")
    private Double area;
    @JsonProperty("built_up_area")
    private Double builtUpArea;
    @JsonProperty("residents_num")
    private Integer residentsNum;
    @JsonProperty("shape")
    private String location;
}
