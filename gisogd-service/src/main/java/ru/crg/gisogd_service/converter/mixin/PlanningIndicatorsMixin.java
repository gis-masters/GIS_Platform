package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.PlanningIndicators;

/**
 * Модель данных Document - PlanningIndicators.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_planning_indicators", objectClass = PlanningIndicators.class)
public class PlanningIndicatorsMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("infrastructure_type")
    private String infrastructureType;
    @JsonProperty("index_type")
    private String indexType;
    @JsonProperty("object_type")
    private String objectType;
    @JsonProperty("unit")
    private String unit;
    @JsonProperty("value")
    private String value;

}
