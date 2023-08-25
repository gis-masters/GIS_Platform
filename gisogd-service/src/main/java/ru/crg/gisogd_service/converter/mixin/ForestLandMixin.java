package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.ForestLand;

/**
 * Model ForestLand.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "forest_land", objectClass = ForestLand.class)
public class ForestLandMixin {

    @JsonProperty("guid_forest_land")
    private String guid;
    @JsonProperty("number1")
    private String number;
    @JsonProperty("area_doc")
    private Double area;
    @JsonProperty("projectDoc")
    private String projectDoc;
    @JsonProperty("forestDevelopDoc")
    private String forestDevelopDoc;

}
