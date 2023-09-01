package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.GPZUInfoP24;

/**
 * Модель данных Document - dl_data_gpzu_info_p2_4.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_gpzu_info_p2_4", objectClass = GPZUInfoP24.class, endpoint = "GPZUInfoP2_4")
public class GpzuInfoP24Mixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("gpzu_fake")
    private String GPZU;
    @JsonProperty("causes")
    private String causes;
    @JsonProperty("order_requisites")
    private String orderRequisites;
    @JsonProperty("usage_requirements")
    private String usageRequirements;
    @JsonProperty("limit_height")
    private Double limitHeight;
    @JsonProperty("limit_building_area")
    private Double limitBuildingArea;
    @JsonProperty("other1")
    private String other1;
    @JsonProperty("limit_indent")
    private Double limitIndent;
    @JsonProperty("other2")
    private String other2;
}
