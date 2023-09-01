package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.ElectricPowerObject;

/**
 * Модель данных из electric_power_object.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "electric_power_object", objectClass = ElectricPowerObject.class)
public class ElectricPowerObjectMixin {

    @JsonProperty("guid_electric_power_object")
    @JsonAlias({"guid_electric_power_object", "guid_electric_power_object_point"})
    private String guid;
    @JsonProperty("class")
    private String propertyClass;
    @JsonProperty("object_name")
    private String objectName;
    @JsonProperty("location_info")
    private String locationInfo;
    @JsonProperty("number")
    private String number;
    @JsonProperty("transformer_power")
    private Double transformerPower;
    @JsonProperty("transformer_amount")
    private Integer transformerAmount;
    @JsonProperty("actual_use")
    private Double actualUse;
    @JsonProperty("fuel_type")
    private String fuelType;
    @JsonProperty("electric_power")
    private Double electricPower;
    @JsonProperty("thermal_power")
    private Double thermalPower;
    @JsonProperty("voltage")
    private String voltage;
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
    @JsonProperty("datasource_fake")
    private String dataSource;
    @JsonProperty("object_grade")
    private String objectGrade;
}
