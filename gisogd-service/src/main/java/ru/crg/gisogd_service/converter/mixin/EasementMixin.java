package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.Easement;

/**
 * Модель данных Document - Easement.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "easement", objectClass = Easement.class)
public class EasementMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("easement_type")
    private String easementType;
    @JsonProperty("status")
    private String status;
    @JsonProperty("area")
    private Double area;
    @JsonProperty("public_easement_type")
    private String publicEasementType;
    @JsonProperty("purpose")
    private String purpose;
    @JsonProperty("egrn_num")
    private String egRNNum;

}
