package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.UGE;

/**
 * Модель данных Document - dl_data_uge.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_uge", objectClass = UGE.class)
public class UgeMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("dl_data_section13_data_connection")
    private String dataSection13;
    @JsonProperty("expertise_object")
    private String expertiseObject;
    @JsonProperty("expertise_type")
    private String expertiseType;
    @JsonProperty("dl_data_work_type_data_connection")
    private String workType;
    @JsonProperty("dl_data_project_developer_data_connection")
    private String projectDeveloper;
    @JsonProperty("is_approved")
    private Boolean isApproved;
}
