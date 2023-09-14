package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.OKS;

import java.util.List;

/**
 * Модель данных Document - OKS.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "oks", objectClass = OKS.class)
public class OksMixin {
    @JsonProperty("guid")
    private String guid;
    @JsonProperty("title")
    private String title;
    @JsonProperty("status")
    private String status;
    @JsonProperty("purpose")
    private String purpose;
    @JsonProperty("cadastralnum")
    private String cadastralNum;
    @JsonProperty("area")
    private Double area;
    @JsonProperty("floorsnumber")
    private String floorsNumber;
    @JsonProperty("height")
    private Double height;
    @JsonProperty("sitoinfo")
    private String siTOInfo;
    @JsonProperty("location")
    private String location;
    @JsonProperty("distrcit")
    private String district;
    @JsonProperty("city")
    private String city;
    @JsonProperty("address")
    private String address;
    @JsonProperty("postal_code")
    private String postalCode;
    @JsonProperty("location_info")
    private String locationInfo;
    @JsonProperty("right_1")
    private String right;
    @JsonProperty("right_number")
    private String rightNumber;
    @JsonProperty("type")
    private String type;
    @JsonProperty("oks_status")
    private String okSStatus;
    @ReverseMapping("permitted_land_use_types")
    private List<String> permittedLandUseTypes;
    @JsonProperty("power")
    private Double power;
    @JsonProperty("power_unit")
    private String powerUnit;
    @JsonProperty("is_okn")
    private Boolean isOKN;
    @JsonProperty("okn_reg_number")
    private String okNRegNumber;
    @JsonProperty("okn_organization")
    private String okNOrganization;
    @JsonProperty("completion_year")
    private Integer completionYear;
    @JsonProperty("commission_year")
    private Integer commissionYear;
    @JsonProperty("reconstruction_year")
    private Integer reconstructionYear;
    @JsonProperty("capconstrcode")
    private String capconstrcode;
    @JsonProperty("cadastre_cost")
    private Double cadastreCost;
    @JsonProperty("house_num")
    private String houseNum1;
    @JsonProperty("house_type")
    private String houseType;
    @JsonProperty("street")
    private String street;
    @JsonProperty("plan_element")
    private String planElement;
}
