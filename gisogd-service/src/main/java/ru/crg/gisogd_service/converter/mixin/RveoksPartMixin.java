package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.Prikaz;
import ru.crg.gisogd_service.model.rf.RVEOKSPart;

/**
 * Модель данных Document - dl_data_rveoks_part.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_rveoks_part", objectClass = RVEOKSPart.class)
public class RveoksPartMixin {

    @JsonProperty("guid")
    private String guid;

    @JsonProperty("decree")
    private Prikaz decree;

    @ReverseMapping(value = "oks", skipcheck = true)
    private String OKS;

    @JsonProperty("dl_data_rveoks_data_connection")
    private String RVEOKS;

    @JsonProperty("docdata")
    private String docData;

    @JsonProperty("docnum")
    private String docNum;

    @JsonProperty("supplier_data_connection")
    private String orgName;

    @JsonProperty("supplieremploey_data_connection")
    private String supplierEmployee;

    @JsonProperty("change_date")
    private String changeData;

    @JsonProperty("customer_data_connection")
    private String customer;

    @JsonProperty("name_from_pd")
    private String nameFromPD;

    @JsonProperty("construction_type")
    private String constructionType;

    @ReverseMapping(value = "landPlot", skipcheck = true)
    private String landPlot;

    @JsonProperty("building_area_fa")
    private Double buildingAreaFa;

    @JsonProperty("building_area_oks_part_fa")
    private Double buildingAreaOKSPartFa;

    @JsonProperty("total_area_fa")
    private Double totalAreaFa;

    @JsonProperty("area_oks_part_fa")
    private Double areaOKSPartFa;

    @JsonProperty("total_area_not_living_pr")
    private Double totalAreaNotLivingPr;

    @JsonProperty("living_area")
    private Double livingArea;

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

    @JsonProperty("number_floor_fa")
    private String numberFloorFa;

    @JsonProperty("number_floor_underground_fa")
    private String numberFloorUndergroundFa;

    @JsonProperty("capacity_fa")
    private String capacityFa;

    @JsonProperty("height_fa")
    private Double heightFa;

    @JsonProperty("other_indicators_fa")
    private String otherIndicatorsFa;

    @JsonProperty("tech_plan_data_connection")
    private String techPlan;

    @JsonProperty("issuedate")
    private String issuedate;

    @JsonProperty("snils_cadaster_engineer")
    private String snILSCadasterEngineer;

    @JsonProperty("line_object_name")
    private String lineObjectName;

    @JsonProperty("line_object_number")
    private String lineObjectNumber;

    @JsonProperty("length_fa")
    private Double lengthFa;

    @JsonProperty("part_length_fa")
    private Double partLengthFa;

    @JsonProperty("category_fa")
    private String categoryFa;

    @JsonProperty("throughput_fa")
    private Double throughputFa;

    @JsonProperty("voltage_level_fa")
    private String voltageLevelFa;

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

    @JsonProperty("elevators_non_prod_data_connection")
    private String elevatorsNonProd;

    @JsonProperty("elevators_non_prod_fac_pr")
    private String elevatorsNonProdFacPr;

    @JsonProperty("elevators_non_prod_fac_fa")
    private String elevatorsNonProdFacFa;

    @JsonProperty("escalators_non_prod_data_connection")
    private String escalatorsNonProd;

    @JsonProperty("escalators_non_prod_fac_pr")
    private String escalatorsNonProdFacPr;

    @JsonProperty("escalators_non_prod_fac_fa")
    private String escalatorsNonProdFacFa;

    @JsonProperty("wheelchair_lifts_non_prod_data_connection")
    private String wheelchairLiftsNonProd;

    @JsonProperty("wheelchair_lifts_non_prod_fac_pr")
    private String wheelchairLiftsNonProdFacPr;

    @JsonProperty("wheelchair_lifts_non_prod_fac_fa")
    private String wheelchairLiftsNonProdFacFa;

    @JsonProperty("elevators_pr")
    private Double elevatorsPr;

    @JsonProperty("elevators_fa")
    private Double elevatorsFa;

    @JsonProperty("escalators_data_connection")
    private String escalators;

    @JsonProperty("escalators_pr")
    private Double escalatorsPr;

    @JsonProperty("escalators_fa")
    private Double escalatorsFa;

    @JsonProperty("wheelchair_lifts_data_connection")
    private String wheelchairLifts;

    @JsonProperty("wheelchair_lifts_pr")
    private Double wheelchairLiftsPr;

    @JsonProperty("wheelchair_lifts_fa")
    private Double wheelchairLiftsFa;

    @JsonProperty("elevators_prod_fac_pr")
    private Double elevatorsProdFacPr;

    @JsonProperty("elevators_prod_fac_fa")
    private Double elevatorsProdFacFa;

    @JsonProperty("escalators_prod_fac_pr")
    private Double escalatorsProdFacPr;

    @JsonProperty("escalators_prod_fac_fa")
    private Double escalatorsProdFacFa;

    @JsonProperty("wheelchair_lifts_prod_fac_pr")
    private Double wheelchairLiftsProdFacPr;

    @JsonProperty("wheelchair_lifts_prod_fac_fa")
    private Double wheelchairLiftsProdFacFa;

    @JsonProperty("prolong_due")
    private String prolongDue;

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

    //TODO нет информации по этому ключу, но он есть в swagger
    @ReverseMapping(value = "number_floor_underground_non_prod_fac_pr", skipcheck = true)
    private Integer numberFloorUndergroundNonProdFacPr;

    //TODO нет информации по этому ключу, но он есть в swagger
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

    @JsonProperty("living_area_without_balcony_fa")
    private Double livingAreaWithoutBalconyfa;
}
