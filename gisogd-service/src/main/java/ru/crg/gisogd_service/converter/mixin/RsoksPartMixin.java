package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.Prikaz;
import ru.crg.gisogd_service.model.rf.RSOKSPart;

/**
 * Модель данных Document - dl_data_rsoks_part.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_rsoks_part", objectClass = RSOKSPart.class)
public class RsoksPartMixin {

    @JsonProperty("guid")
    private String guid;

    @JsonProperty("decree")
    private Prikaz decree;

    @ReverseMapping("oks")
    private String OKS;

    @ReverseMapping("dl_data_rsoks_data_connection")
    private String RSOKS;

    @JsonProperty("oks_project_info")
    private String okSProjectInfo;

    @JsonProperty("volume")
    private Double volume;

    @JsonProperty("under_land_area")
    private Double underLandArea;

    @JsonProperty("land_area")
    private Double landArea;

    @JsonProperty("under_floor_number")
    private String underFloorNumber;

    @JsonProperty("resident_number")
    private String residentNumber;

    @JsonProperty("building_area")
    private Double buildingArea;

    @JsonProperty("other_param_info")
    private String otherParamInfo;

    @JsonProperty("line_object_project_info")
    private String lineObjectProjectInfo;

    @JsonProperty("line_object_category")
    private String lineObjectCategory;

    @JsonProperty("line_object_length")
    private Double lineObjectLength;

    @JsonProperty("line_object_power")
    private Double lineObjectPower;

    @JsonProperty("line_object_voltage")
    private String lineObjectVoltage;

    @JsonProperty("line_object_safety")
    private String lineObjectSafety;

    @JsonProperty("building_area_oks_part")
    private Double buildingAreaOKSPart;

    @JsonProperty("area_oks_part")
    private Double areaOKSPart;

    @JsonProperty("not_living_area")
    private Double notLivingArea;

    @JsonProperty("living_area")
    private Double livingArea;

    @JsonProperty("number_room")
    private String numberRoom;

    @JsonProperty("number_not_living_room")
    private String numberNotLivingRoom;

    @JsonProperty("number_living_room")
    private String numberLivingRoom;

    @JsonProperty("appartments_total")
    private String appartmentsTotal;

    @JsonProperty("parking_space")
    private Integer parkingSpace;

    @JsonProperty("number_place_non_prod_fac_pr")
    private Integer numberPlaceNonProdFacPr;

    @JsonProperty("number_place_non_prod_fac_fa")
    private Integer numberPlaceNonProdFacFa;

    @JsonProperty("number_room_non_prod_fac_pr")
    private Integer numberRoomNonProdFacPr;

    @JsonProperty("number_room_non_prod_fac_fa")
    private Integer numberRoomNonProdFacFa;

    @JsonProperty("capacity_non_prod_fac_pr")
    private Integer capacityNonProdFacPr;

    @JsonProperty("capacity_non_prod_fac_fa")
    private Integer capacityNonProdFacFa;

    @JsonProperty("number_floor_non_prod_fac_pr")
    private Integer numberFloorNonProdFacPr;

    @JsonProperty("number_floor_non_prod_fac_fa")
    private Integer numberFloorNonProdFacFa;

    @ReverseMapping(value = "number_floor_underground_non_prod_fac_pr", skipcheck = true)
    private Integer numberFloorUndergroundNonProdFacPr;

    @ReverseMapping(value = "number_floor_underground_non_prod_fac_fa", skipcheck = true)
    private Integer numberFloorUndergroundNonProdFacFa;

    @JsonProperty("eng_systems_non_prod_fac_pr")
    private String engSystemsNonProdFacPr;

    @JsonProperty("eng_systems_non_prod_fac_fa")
    private String engSystemsNonProdFacFa;

    @JsonProperty("foundation_materials_non_prod_fac_pr")
    private String foundationMaterialsNonProdFacPr;

    @JsonProperty("foundation_materials_non_prod_fac_fa")
    private String foundationMaterialsNonProdFacFa;

    @JsonProperty("wall_materials_non_prod_fac_pr")
    private String wallMaterialsNonProdFacPr;

    @JsonProperty("wall_materials_non_prod_fac_fa")
    private String wallMaterialsNonProdFacFa;

    @JsonProperty("floor_materials_non_prod_fac_pr")
    private String floorMaterialsNonProdFacPr;

    @JsonProperty("floor_materials_non_prod_fac_fa")
    private String floorMaterialsNonProdFacFa;

    @JsonProperty("roof_materials_non_prod_fac_pr")
    private String roofMaterialsNonProdFacPr;

    @JsonProperty("roof_materials_non_prod_fac_fa")
    private String roofMaterialsNonProdFacFa;

    @JsonProperty("other_indicators_non_prod_fac_pr")
    private String otherIndicatorsNonProdFacPr;

    @JsonProperty("other_indicators_non_prod_fac_fa")
    private String otherIndicatorsNonProdFacFa;

    @JsonProperty("living_area_without_balcony_pr")
    private Double livingAreaWithoutBalconyPr;

    @JsonProperty("area_not_living_pr")
    private Double areaNotLivingPr;

    @JsonProperty("area_not_living_fa")
    private Double areaNotLivingFa;

    @JsonProperty("number_floor_pr")
    private String numberFloorPr;

    @JsonProperty("number_floor_underground_pr")
    private String numberFloorUndergroundPr;

    @JsonProperty("number_floor_underground_fa")
    private String numberFloorUndergroundFa;

    @JsonProperty("number_sections_pr")
    private String numberSectionsPr;

    @JsonProperty("number_sections_fa")
    private String numberSectionsFa;

    @JsonProperty("appartments_total_pr")
    private String appartmentsTotalPr;

    @JsonProperty("appartments_total_area_pr")
    private Double appartmentsTotalAreaPr;

    @JsonProperty("appartments_total_area_fa")
    private Double appartmentsTotalAreaFa;

    @JsonProperty("one_room_pr")
    private String oneRoomPr;

    @JsonProperty("one_room_fa")
    private String oneRoomFa;

    @JsonProperty("one_room_area_pr")
    private Double oneRoomAreaPr;

    @JsonProperty("one_room_area_fa")
    private Double oneRoomAreaFa;

    @JsonProperty("two_room_pr")
    private String twoRoomPr;

    @JsonProperty("two_room_fa")
    private String twoRoomFa;

    @JsonProperty("two_room_area_pr")
    private Double twoRoomAreaPr;

    @JsonProperty("two_room_area_fa")
    private Double twoRoomAreaFa;

    @JsonProperty("three_room_pr")
    private String threeRoomPr;

    @JsonProperty("three_room_fa")
    private String threeRoomFa;

    @JsonProperty("three_room_area_pr")
    private Double threeRoomAreaPr;

    @JsonProperty("three_room_area_fa")
    private Double threeRoomAreaFa;

    @JsonProperty("four_room_pr")
    private String fourRoomPr;

    @JsonProperty("four_room_fa")
    private String fourRoomFa;

    @JsonProperty("four_room_area_pr")
    private Double fourRoomAreaPr;

    @JsonProperty("four_room_area_fa")
    private Double fourRoomAreaFa;

    @JsonProperty("more_then_four_room_pr")
    private String moreThenFourRoomPr;

    @JsonProperty("more_then_four_room_fa")
    private String moreThenFourRoomFa;

    @JsonProperty("more_then_four_room_area_pr")
    private Double moreThenFourRoomAreaPr;

    @JsonProperty("more_then_four_room_area_fa")
    private Double moreThenFourRoomAreaFa;

    @JsonProperty("living_area_with_balcony_pr")
    private Double livingAreaWithBalconyPr;

    @JsonProperty("living_area_with_balcony_fa")
    private Double livingAreaWithBalconyFa;

    @JsonProperty("eng_systems_pr")
    private String engSystemsPr;

    @JsonProperty("eng_systems_fa")
    private String engSystemsFa;

    @JsonProperty("foundation_materials_fa")
    private String foundationMaterialsFa;

    @JsonProperty("foundation_materials_pr")
    private String foundationMaterialsPr;

    @JsonProperty("wall_materials_pr")
    private String wallMaterialsPr;

    @JsonProperty("wall_materials_fa")
    private String wallMaterialsFa;

    @JsonProperty("floor_materials_pr")
    private String floorMaterialsPr;

    @JsonProperty("floor_materials_fa")
    private String floorMaterialsFa;

    @JsonProperty("roof_materials_pr")
    private String roofMaterialsPr;

    @JsonProperty("roof_materials_fa")
    private String roofMaterialsFa;

    @JsonProperty("other_indicators_pr")
    private String otherIndicatorsPr;

    @JsonProperty("other_indicators_fa")
    private String otherIndicatorsFa;

    @JsonProperty("object_name_from_pd")
    private String objectNameFromPD;

    @JsonProperty("oks_type_pr")
    private String okSTypePr;

    @JsonProperty("oks_type_fa")
    private String okSTypeFa;

    @ReverseMapping("oks_purpose")
    private String okSPurpose;

    @JsonProperty("power_pr")
    private Double powerPr;

    @JsonProperty("power_fa")
    private Double powerFa;

    @JsonProperty("performance_pr")
    private Double performancePr;

    @JsonProperty("performance_fa")
    private Double performanceFa;

    @JsonProperty("eng_systems_prod_fac_pr")
    private String engSystemsProdFacPr;

    @JsonProperty("eng_systems_prod_fac_fa")
    private String engSystemsProdFacFa;

    @JsonProperty("foundation_materials_prod_fac_pr")
    private String foundationMaterialsProdFacPr;

    @JsonProperty("foundation_materials_prod_fac_fa")
    private String foundationMaterialsProdFacFa;

    @JsonProperty("wall_materials_prod_fac_pr")
    private String wallMaterialsProdFacPr;

    @JsonProperty("wall_materials_prod_fac_fa")
    private String wallMaterialsProdFacFa;

    @JsonProperty("floor_materials_prod_fac_pr")
    private String floorMaterialsProdFacPr;

    @JsonProperty("floor_materials_prod_fac_fa")
    private String floorMaterialsProdFacFa;

    @JsonProperty("roof_materials_prod_fac_pr")
    private String roofMaterialsProdFacPr;

    @JsonProperty("roof_materials_prod_fac_fa")
    private String roofMaterialsProdFacFa;

    @JsonProperty("other_indicators_prod_fac_pr")
    private String otherIndicatorsProdFacPr;

    @JsonProperty("other_indicators_prod_fac_fa")
    private String otherIndicatorsProdFacFa;

    @JsonProperty("category_pr")
    private String categoryPr;

    @JsonProperty("category_fa")
    private String categoryFa;

    @JsonProperty("length_pr")
    private Double lengthPr;

    @JsonProperty("length_fa")
    private Double lengthFa;

    @JsonProperty("throughput_pr")
    private Double throughputPr;

    @JsonProperty("throughput_fa")
    private Double throughputFa;

    @JsonProperty("pipelines_info_pr")
    private String pipelinesInfoPr;

    @JsonProperty("pipelines_info_fa")
    private String pipelinesInfoFa;

    @JsonProperty("voltage_level_pr")
    private String voltageLevelPr;

    @JsonProperty("voltage_level_fa")
    private String voltageLevelFa;

    @JsonProperty("structural_elements_safety_pr")
    private String structuralElementsSafetyPr;

    @JsonProperty("structural_elements_safety_fa")
    private String structuralElementsSafetyFa;

    @JsonProperty("line_object_other_info")
    private String lineObjectOtherInfo;

    @JsonProperty("line_object_other_info_fa")
    private String lineObjectOtherInfoFa;

    @JsonProperty("energy_efficiency_class_pr")
    private String energyEfficiencyClassPr;

    @JsonProperty("energy_efficiency_class_fa")
    private String energyEfficiencyClassFa;

    @JsonProperty("specific_consumption_thermal_energy_pr")
    private Double specificConsumptionThermalEnergyPr;

    @JsonProperty("specific_consumption_thermal_energy_fa")
    private Double specificConsumptionThermalEnergyFa;

    @JsonProperty("insulation_materials_external_enclosing_structures_pr")
    private String insulationMaterialsExternalEnclosingStructuresPr;

    @JsonProperty("insulation_materials_external_enclosing_structures_fa")
    private String insulationMaterialsExternalEnclosingStructuresFa;

    @JsonProperty("filling_light_openings_pr")
    private String fillingLightOpeningsPr;

    @JsonProperty("filling_light_openings_fa")
    private String fillingLightOpeningsFa;

    @JsonProperty("building_area_fa")
    private Double buildingAreaFa;

    @JsonProperty("building_area_oks_part_fa")
    private Double buildingAreaOKSPartFa;

    @JsonProperty("area_oks_part_fa")
    private Double areaOKSPartFa;

    @JsonProperty("total_area_not_living_fa")
    private Double totalAreaNotLivingFa;

    @JsonProperty("living_area_without_balcony_fa")
    private Double livingAreaWithoutBalconyFa;

    @JsonProperty("number_room_fa")
    private String numberRoomFa;

    @JsonProperty("number_not_living_room_fa")
    private String numberNotLivingRoomFa;

    @JsonProperty("number_living_room_fa")
    private String numberLivingRoomFa;

    @JsonProperty("appartments_total_fa")
    private String appartmentsTotalFa;

    @JsonProperty("parking_space_fa")
    private String parkingSpaceFa;

    @JsonProperty("capacity_fa")
    private String capacityFa;

    @JsonProperty("line_object_name")
    private String lineObjectName;

    @JsonProperty("line_object_number")
    private String lineObjectNumber;

    @JsonProperty("part_length_fa")
    private Double partLengthFa;

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

    @JsonProperty("built_in_area_pr")
    private Double builtInAreaPr;

    @JsonProperty("built_in_area_fa")
    private Double builtInAreaFa;

    @JsonProperty("number_buildings_pr")
    private String numberBuildingsPr;

    @JsonProperty("number_buildings_fa")
    private String numberBuildingsFa;

    @ReverseMapping("elevators_non_prod_data_connection")
    private String elevatorsNonProd;

    @JsonProperty("elevators_non_prod_fac_pr")
    private String elevatorsNonProdFacPr;

    @JsonProperty("elevators_non_prod_fac_fa")
    private String elevatorsNonProdFacFa;

    @ReverseMapping("escalators_non_prod_data_connection")
    private String escalatorsNonProd;

    @JsonProperty("escalators_non_prod_fac_pr")
    private String escalatorsNonProdFacPr;

    @JsonProperty("escalators_non_prod_fac_fa")
    private String escalatorsNonProdFacFa;

    @ReverseMapping("wheelchair_lifts_non_prod_data_connection")
    private String wheelchairLiftsNonProd;

    @JsonProperty("wheelchair_lifts_non_prod_fac_pr")
    private String wheelchairLiftsNonProdFacPr;

    @JsonProperty("wheelchair_lifts_non_prod_fac_fa")
    private String wheelchairLiftsNonProdFacFa;

    @JsonProperty("elevators_pr")
    private Double elevatorsPr;

    @JsonProperty("elevators_fa")
    private Double elevatorsFa;

    @ReverseMapping("escalators_data_connection")
    private String escalators;

    @JsonProperty("escalators_pr")
    private Double escalatorsPr;

    @JsonProperty("escalators_fa")
    private Double escalatorsFa;

    @ReverseMapping("wheelchair_lifts_data_connection")
    private String wheelchairLifts;

    @JsonProperty("wheelchair_lifts_pr")
    private Double wheelchairLiftsPr;

    @JsonProperty("wheelchair_lifts_fa")
    private Double wheelchairLiftsFa;

    @JsonProperty("elevators_prod_fac")
    private Double elevatorsProdFac;

    @JsonProperty("elevators_prod_fac_pr")
    private Double elevatorsProdFacPr;

    @JsonProperty("elevators_prod_fac_fa")
    private Double elevatorsProdFacFa;

    @JsonProperty("escalators_prod_fac")
    private Double escalatorsProdFac;

    @JsonProperty("escalators_prod_fac_pr")
    private Double escalatorsProdFacPr;

    @JsonProperty("escalators_prod_fac_fa")
    private Double escalatorsProdFacFa;

    @JsonProperty("wheelchair_lifts_prod_fac")
    private Double wheelchairLiftsProdFac;

    @JsonProperty("wheelchair_lifts_prod_fac_pr")
    private Double wheelchairLiftsProdFacPr;

    @JsonProperty("wheelchair_lifts_prod_fac_fa")
    private Double wheelchairLiftsProdFacFa;

    @JsonProperty("prolong_due")
    private String prolongDue;
}
