package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.PowerLines;

/**
 * Модель данных из tasks power_lines.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "power_lines", objectClass = PowerLines.class)
public class PowerLinesMixin {

    @JsonProperty("guid_power_lines")
    private String guid;
    @JsonProperty("class")
    private String propertyClass;
    @JsonProperty("object_name")
    private String objectName;
    @JsonProperty("location_info")
    private String locationInfo;
    @JsonProperty("number")
    private String number;
    @JsonProperty("voltage")
    private String voltage          ;
    @JsonProperty("power_lines_type")
    private String powerLinesType;
    @JsonProperty("lenght")
    private Double length;
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
    private String dataSource;
    @JsonProperty("object_grade")
    private String objectGrade;

}
