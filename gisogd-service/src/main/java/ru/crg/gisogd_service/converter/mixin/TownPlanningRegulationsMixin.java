package ru.crg.gisogd_service.converter.mixin;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.TownPlanningRegulations;

/**
 * Модель данных Document - TownPlanningRegulations.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_town_planning_regulations", objectClass = TownPlanningRegulations.class)
public class TownPlanningRegulationsMixin {

    @JsonProperty("guid")
    private String guid;
    @ReverseMapping("permitted_use_parameters")
    private List<String> permittedUseParameters;
    @JsonProperty("use_restrictions")
    private String useRestrictions;
    @ReverseMapping("terzone")
    private List<String> terZone;
    @ReverseMapping("permitted_land_use_types")
    private List<String> permittedLandUseTypes;
    @ReverseMapping("planning_indicators")
    private List<String> planningIndicators;

}
