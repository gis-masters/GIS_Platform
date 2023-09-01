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
    @JsonProperty("dataSection13_fake")
    private String dataSection13;
    @JsonProperty("expertise_object")
    private String expertiseObject;
    @JsonProperty("expertise_type")
    private String expertiseType;
    @JsonProperty("workType_fake")
    private String workType;
    @JsonProperty("projectDeveloper_fake")
    private String projectDeveloper;
    @JsonProperty("is_approved")
    private Boolean isApproved;
}
