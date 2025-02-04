package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.ForestQuarter;

/**
 * Model ForestQuarter.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "forest_quarter", objectClass = ForestQuarter.class)
public class ForestQuarterMixin {
    @JsonProperty("guid_quarter")
    private String guid;
    @JsonProperty("name")
    private String name;
    @JsonProperty("forestry")
    private String forestry;
    @JsonProperty("purpose")
    private String purpose;
    @JsonProperty("area_doc")
    private Double area;

}
