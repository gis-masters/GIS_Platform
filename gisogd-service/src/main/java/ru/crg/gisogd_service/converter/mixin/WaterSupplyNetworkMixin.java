package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.WaterSupplyNetwork;

/**
 * Модель данных из water_supply_network.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "water_supply_network", objectClass = WaterSupplyNetwork.class)
public class WaterSupplyNetworkMixin {

    @JsonProperty("guid_water_supply_network")
    private String guid;
    @JsonProperty("class")
    private String propertyClass;
    @JsonProperty("object_name")
    private String objectName;
    @JsonProperty("location_info")
    private String locationInfo;
    @JsonProperty("number")
    private String number;
    @JsonProperty("lenght")
    private Double length;
    @JsonProperty("diameter")
    private Double diameter;
    @JsonProperty("pipes_amount")
    private Integer pipesAmount;
    @JsonProperty("layout")
    private String layout;
    @JsonProperty("status")
    private String status;
    @JsonProperty("deterioration_percent")
    private Double deteriorationPercent;
    @JsonProperty("ownership_type")
    private String ownershipType;
    @JsonProperty("balance_hoder")
    private String balanceHolder;
    @JsonProperty("completion_year")
    private String completionYear;
    @JsonProperty("reconstruction_year")
    private String reconstructionYear;
    @JsonProperty("datasource_fake")
    private String dataSource;
    @JsonProperty("object_grade")
    private String objectGrade;
    @JsonProperty("tube_material")
    private String tubeMaterial;
}
