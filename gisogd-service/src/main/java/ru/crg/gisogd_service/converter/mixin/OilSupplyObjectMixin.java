package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.OilSupplyObject;

/**
 * Модель данных из oil_supply_object.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "oil_supply_object", objectClass = OilSupplyObject.class)
public class OilSupplyObjectMixin {

    @JsonProperty("guid_oil_supply_object")
    @JsonAlias({"guid_oil_supply_object", "guid_oil_supply_object_point"})
    private String guid;
    @JsonProperty("class")
    private String propertyClass;
    @JsonProperty("object_name")
    private String objectName;
    @JsonProperty("location_info")
    private String locationInfo;
    @JsonProperty("number")
    private String number;
    @JsonProperty("actual_use")
    private Double actualUse;
    @JsonProperty("performance")
    private Double performance;
    @JsonProperty("power")
    private Double power;
    @JsonProperty("power_unit")
    private String powerUnit;
    @JsonProperty("volume")
    private Double volume;
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
