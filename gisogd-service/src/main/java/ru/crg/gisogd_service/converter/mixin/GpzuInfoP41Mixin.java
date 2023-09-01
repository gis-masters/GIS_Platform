package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.GPZUInfoP41;

/**
 * Модель данных Document - dl_data_gpzu_info_p4_1.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_gpzu_info_p4_1", objectClass = GPZUInfoP41.class, endpoint = "GPZUInfoP4_1")
public class GpzuInfoP41Mixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("gpzu_fake")
    private String GPZU;
    @JsonProperty("communal_object")
    private String communalObject;
    @JsonProperty("communal_measure")
    private String communalMeasure;
    @JsonProperty("communal_min")
    private Double communalMin;
    @JsonProperty("communal_max")
    private Double communalMax;
    @JsonProperty("transport_object")
    private String transportObject;
    @JsonProperty("transport_measure")
    private String transportMeasure;
    @JsonProperty("transport_min")
    private Double transportMin;
    @JsonProperty("transport_max")
    private Double transportMax;
    @JsonProperty("social_object")
    private String socialObject;
    @JsonProperty("social_measure")
    private String socialMeasure;
    @JsonProperty("social_min")
    private Double socialMin;
    @JsonProperty("social_max")
    private Double socialMax;
}
