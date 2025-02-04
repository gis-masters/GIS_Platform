package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.Lifts;

/**
 * Модель данных Document - dl_data_lifts.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_lifts", objectClass = Lifts.class)
public class LiftsMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("title")
    private String title;
    @JsonProperty("lift_info")
    private String liftInfo;
    @JsonProperty("elevators_non_prod_fac_pr")
    private Integer elevatorsNonProdFacPr;
    @JsonProperty("elevators_non_prod_fac_fa")
    private Integer elevatorsNonProdFacFa;
    @JsonProperty("elevators_prod_fac_pr")
    private Integer elevatorsProdFacPr;
    @JsonProperty("elevators_prod_fac_fa")
    private Integer elevatorsProdFacFa;
}
