package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.GPZUInfoP25;

/**
 * Модель данных Document - dl_data_gpzu_info_p2_5.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_gpzu_info_p2_5", objectClass = GPZUInfoP25.class, endpoint = "GPZUInfoP2_5")
public class GpzuInfoP25Mixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("dl_data_gpzu_data_connection")
    private String GPZU;
    @JsonProperty("causes")
    private String causes;
    @JsonProperty("order_requisites")
    private String orderRequisites;
    @JsonProperty("document_requisites")
    private String documentRequisites;
    @JsonProperty("functional_area")
    private String functionalArea;
    @JsonProperty("main_usage_requirements")
    private String mainUsageRequirements;
    @JsonProperty("aux_usage_requirements")
    private String auxUsageRequirements;
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
