package ru.crg.gisogd_service.converter.mixin;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.RSOKS;

/**
 * Модель данных Document - dl_data_rsoks.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_rsoks", objectClass = RSOKS.class)
public class RsoksMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("dataSection13_fake")
    private String dataSection13;
    @JsonProperty("expertise_fake")
    private String expertise;
    @JsonProperty("ppm_info")
    private String ppMInfo;
    @JsonProperty("project_info")
    private String projectInfo;
    @JsonProperty("gpzu_fake")
    private List<String> GPZU;
    @JsonProperty("srzu_fake")
    private String SRZU;
    @JsonProperty("ppm_fake")
    private String PPM;
    @JsonProperty("ppt_fake")
    private String PPT;
    @JsonProperty("projectDeveloper_fake")
    private String projectDeveloper;
    @JsonProperty("projectDoc_fake")
    private String projectDoc;
    @JsonProperty("tar_fake")
    private String TAR;
    @JsonProperty("gece_fake")
    private String GECE;
    @JsonProperty("ps3_8_49_fake")
    private String PS3_8_49;
    @JsonProperty("ps3_9_49_fake")
    private String PS3_9_49;
}
