package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.ForestDistrict;

/**
 * Model ForestDistrict.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "forest_district", objectClass = ForestDistrict.class)
public class ForestDistrictMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("name")
    private String name;
    @JsonProperty("forestry")
    private String forestry;
    @JsonProperty("area_doc")
    private Double area;

}
