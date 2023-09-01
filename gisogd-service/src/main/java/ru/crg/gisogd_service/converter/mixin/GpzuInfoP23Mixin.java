package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.GPZUInfoP23;

/**
 * Модель данных Document - dl_data_gpzu_info_p2_3.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_gpzu_info_p2_3", objectClass = GPZUInfoP23.class, endpoint = "GPZUInfoP2_3")
public class GpzuInfoP23Mixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("gpzu_fake")
    private String GPZU;
    @JsonProperty("limit_length")
    private Double limitLength;
    @JsonProperty("limit_width")
    private Double limitWidth;
    @JsonProperty("limit_area")
    private Double limitArea;
    @JsonProperty("limit_indent")
    private Double limitIndent;
    @JsonProperty("limit_height")
    private Double limitHeight;
    @JsonProperty("limit_building_area")
    private Double limitBuildingArea;
    @JsonProperty("project_requisites")
    private String archRequirements;
    @JsonProperty("limit_living_area")
    private Double limitLivingArea;
    @JsonProperty("other")
    private String other;
}
