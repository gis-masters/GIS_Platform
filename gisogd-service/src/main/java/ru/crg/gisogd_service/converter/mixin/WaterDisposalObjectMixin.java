package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.WaterDisposalObject;

/**
 * Модель данных из water_disposal_object.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "water_disposal_object", objectClass = WaterDisposalObject.class)
public class WaterDisposalObjectMixin {

    @JsonProperty("guid_water_disposal_object")
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
    @JsonProperty("spz_size")
    private Double spZSize;
    @JsonProperty("zone_size")
    private Double zoneSize;
    @ReverseMapping("file")
    private String dataSource;
    @JsonProperty("object_grade")
    private String objectGrade;
}
