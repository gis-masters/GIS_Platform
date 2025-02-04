package ru.crg.gisogd_service.converter.mixin;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.Forestry;

/**
 * Model Forestry.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "forestry", objectClass = Forestry.class)
public class ForestryMixin {

    @JsonProperty("guid_forestry")
    private String guid;
    @JsonProperty("name")
    private String name;
    @JsonProperty("area_doc")
    private Double area;
    @JsonProperty("forest_regulation")
    private String forestRegulation;
    @ReverseMapping("permitted_land_use_types")
    private List<String> permittedUseType;

}
