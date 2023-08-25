package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.TownPlanningRegulations;

/**
 * Модель данных Document - TownPlanningRegulations.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_town_planning_regulations", objectClass = TownPlanningRegulations.class)
public class TownPlanningRegulationsMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("use_restrictions")
    private String useRestrictions;

}
