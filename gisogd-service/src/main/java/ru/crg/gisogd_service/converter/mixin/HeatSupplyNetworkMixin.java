package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.HeatSupplyNetwork;

/**
 * Модель данных из heat_supply_network.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "heat_supply_network", objectClass = HeatSupplyNetwork.class)
public class HeatSupplyNetworkMixin {

    @JsonProperty("guid_heat_supply_network")
    private String guid;
    @JsonProperty("class")
    private String propertyClass;
    @JsonProperty("object_name")
    private String objectName;
    @JsonProperty("location_info")
    private String locationInfo;
    @JsonProperty("number")
    private String number;
    @JsonProperty("layout")
    private String layout;
    @JsonProperty("lenght")
    private Double length;
    @JsonProperty("diameter1")
    private Double diameter1;
    @JsonProperty("diameter2")
    private Double diameter2;
    @JsonProperty("diameter3")
    private Double diameter3;
    @JsonProperty("diameter4")
    private Double diameter4;
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
    @JsonProperty("zone_size")
    private Double zoneSize;
    @JsonProperty("datasource_fake")
    private String dataSource;
    @JsonProperty("object_grade")
    private String objectGrade;
}
