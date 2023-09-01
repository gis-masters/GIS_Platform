package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.WheelchairLifts;

/**
 * Модель данных Document - dl_data_wheelchair_lifts.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_wheelchair_lifts", objectClass = WheelchairLifts.class)
public class WheelchairLiftsMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("title")
    private String title;
    @JsonProperty("wheelchair_lift_info")
    private String wheelchairLiftInfo;
    @JsonProperty("wheelchair_lifts_non_prod_fac_pr")
    private Integer wheelchairLiftsNonProdFacPr;
    @JsonProperty("wheelchair_lifts_non_prod_fac_fa")
    private Integer wheelchairLiftsNonProdFacFa;
    @JsonProperty("wheelchair_lifts_prod_fac_pr")
    private Integer wheelchairLiftsProdFacPr;
    @JsonProperty("wheelchair_lifts_prod_fac_fa")
    private Integer wheelchairLiftsProdFacFa;
}
