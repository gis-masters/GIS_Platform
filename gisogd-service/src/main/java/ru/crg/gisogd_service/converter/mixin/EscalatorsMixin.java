package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.Escalators;

/**
 * Модель данных Document - dl_data_citizen.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_escalators", objectClass = Escalators.class)
public class EscalatorsMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("title")
    private String title;
    @JsonProperty("escalator_info")
    private String escalatorInfo;
    @JsonProperty("escalators_non_prod_fac_pr")
    private Integer escalatorsNonProdFacPr;
    @JsonProperty("escalators_non_prod_fac_fa")
    private Integer escalatorsNonProdFacFa;
    @JsonProperty("escalators_prod_fac_pr")
    private Integer escalatorsProdFacPr;
    @JsonProperty("escalators_prod_fac_fa")
    private Integer escalatorsProdFacFa;
}
