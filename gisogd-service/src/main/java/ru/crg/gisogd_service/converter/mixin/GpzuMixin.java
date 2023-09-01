package ru.crg.gisogd_service.converter.mixin;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.GPZU;

/**
 * Модель данных Document - dl_data_gpzu.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_gpzu", objectClass = GPZU.class)
public class GpzuMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("dataSection13_fake")
    private String dataSection13;
    @JsonProperty("project_requisites")
    private String projectRequisites;
    @JsonProperty("projectDeveloper_fake")
    private String projectDeveloper;
    @JsonProperty("info_p2")
    private String infoP2;
    @JsonProperty("info_p2_1")
    private String infoP21;
    @JsonProperty("infoP221_fake")
    private List<String> infoP221;
    @JsonProperty("infoP222_fake")
    private List<String> infoP222;
    @JsonProperty("infoP223_fake")
    private List<String> infoP223;
    @JsonProperty("info_p5")
    private String infoP5;
    @JsonProperty("info_p7")
    private String infoP7;
    @JsonProperty("info_p8")
    private String infoP8;
    @JsonProperty("info_p9")
    private String infoP9;
    @JsonProperty("info_p10")
    private String infoP10;
    @JsonProperty("info_p11")
    private String infoP11;
    @JsonProperty("info_p3")
    private String infoP3;
}
