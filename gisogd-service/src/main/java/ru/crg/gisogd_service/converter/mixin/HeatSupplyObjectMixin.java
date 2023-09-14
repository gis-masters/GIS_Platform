package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.HeatSupplyObject;

/**
 * Модель данных из oil_supply_object.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "heat_supply_object", objectClass = HeatSupplyObject.class)
public class HeatSupplyObjectMixin {

    @JsonProperty("guid_heat_supply_object")
    @JsonAlias({"guid_heat_supply_object_point", "guid_heat_supply_object"})
    private String guid;
    @JsonProperty("class")
    private String propertyClass;
    @JsonProperty("object_name")
    private String objectName;
    @JsonProperty("location_info")
    private String locationInfo;
    @JsonProperty("number")
    private String number;
    @JsonProperty("fuel_type")
    private String fuelType;
    @JsonProperty("actual_use")
    private Double actualUse;
    @JsonProperty("electric_power")
    private Double electricPower;
    @JsonProperty("thermal_power")
    private Double thermalPower;
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
    @JsonProperty("spz_size")
    private Double spZSize;
    @JsonProperty("zone_size")
    private Double zoneSize;
    @ReverseMapping("file")
    private String dataSource;
    @JsonProperty("object_grade")
    private String objectGrade;
}
