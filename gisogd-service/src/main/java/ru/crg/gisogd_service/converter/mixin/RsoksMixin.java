package ru.crg.gisogd_service.converter.mixin;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.RSOKS;

/**
 * Модель данных Document - dl_data_rsoks.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_rsoks", objectClass = RSOKS.class)
public class RsoksMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("dl_data_section13_data_connection")
    private String dataSection13;
    @JsonProperty("dl_data_uge_data_connection")
    private String expertise;
    @JsonProperty("ppm_info")
    private String ppMInfo;
    @JsonProperty("project_info")
    private String projectInfo;
    @ReverseMapping("dl_data_gpzu_data_connection")
    private List<String> GPZU;
    @JsonProperty("dl_data_srzu_data_connection")
    private String SRZU;
    @JsonProperty("dl_data_ppm_data_connection")
    private String PPM;
    @JsonProperty("dl_data_ppt_data_connection")
    private String PPT;
    @JsonProperty("dl_data_project_developer_data_connection")
    private String projectDeveloper;
    @JsonProperty("dl_data_project_doc_data_connection")
    private String projectDoc;
    @JsonProperty("dl_data_tar_data_connection")
    private String TAR;
    @JsonProperty("dl_data_gece_data_connection")
    private String GECE;
    @JsonProperty("dl_data_ps3_8_49_data_connection")
    private String PS3_8_49;
    @JsonProperty("dl_data_ps3_9_49_data_connection")
    private String PS3_9_49;
}
