package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.Pipeline;

/**
 * Модель данных из tasks pipeline.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "pipeline", objectClass = Pipeline.class)
public class PipeLineMixin {

    @JsonProperty("guid_pipeline")
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
    @JsonProperty("pressure")
    private Double pressure;
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
    @JsonProperty("spz_size")
    private Double spZSize;
    @JsonProperty("zone_size")
    private Double zoneSize;
    @JsonProperty("min_zone")
    private Double minZone;
    @ReverseMapping("file")
    private String dataSource;
    @JsonProperty("object_grade")
    private String objectGrade;
    @JsonProperty("tube_material")
    private String tubeMaterial;
}
