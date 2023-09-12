package ru.crg.gisogd_service.converter.mixin;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.RVEOKS;

/**
 * Модель данных Document - dl_data_rveoks.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_rveoks", objectClass = RVEOKS.class)
public class RveoksMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("datasection13_fake")
    private String dataSection13;
    @JsonProperty("address_assignment_doc")
    private String addressAssignmentDoc;
    @JsonProperty("building_address")
    private String buildingAddress;
    @JsonProperty("building_volume_total_pr")
    private Double buildingVolumeTotalPr;
    @JsonProperty("building_volume_total_fa")
    private Double buildingVolumeTotalFa;
    @JsonProperty("building_volume_total_above_ground_pr")
    private Double buildingVolumeTotalAboveGroundPr;
    @JsonProperty("building_volume_total_above_ground_fa")
    private Double buildingVolumeTotalAboveGroundFa;
    @JsonProperty("total_area_pr")
    private Double totalAreaPr;
    @JsonProperty("total_area_living_pr")
    private Double totalAreaLivingPr;
    @JsonProperty("built_in_area_pr")
    private Double builtInAreaPr;
    @JsonProperty("built_in_area_fa")
    private Double builtInAreaFa;
    @JsonProperty("number_buildings_pr")
    private Integer numberBuildingsPr;
    @JsonProperty("number_buildings_fa")
    private Integer numberBuildingsFa;
    @JsonProperty("number_place_pr")
    private Integer numberPlacePr;
    @JsonProperty("number_place_fa")
    private Integer numberPlaceFa;
    @JsonProperty("number_room_pr")
    private Integer numberRoomPr;
    @JsonProperty("capacity_pr")
    private Integer capacityPr;
    @JsonProperty("living_area")
    private Double livingArea;
    @JsonProperty("tech_plan_title")
    private String techPlanTitle;
    @JsonProperty("full_name_cadastre_engineer")
    private String fullNameCadastreEngineer;
    @JsonProperty("rsoks_fake")
    private String RSOKS;
    @JsonProperty("techPlan_fake")
    private List<String> techPlan;
}
