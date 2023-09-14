package ru.crg.gisogd_service.converter.mixin;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.LandPlot;

/**
 * Модель данных Document - LandPlot
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "landplot", objectClass = LandPlot.class)
public class LandPlotMixin {

    @JsonProperty("landplot_plot_guid")
    private String guid;
    @JsonProperty("status")
    private String status;
    @JsonProperty("cadastralnum")
    private String cadastralNum;
    @JsonProperty("area")
    private Double area;
    @JsonProperty("location_info")
    private String locationInfo;
    @JsonProperty("easement")
    private String easement;
    @JsonProperty("shape")
    private String location;
    @JsonProperty("guid")
    private String territory;
    @JsonProperty("district")
    private String district;
    @JsonProperty("city")
    private String city;
    @JsonProperty("address")
    private String address;
    @JsonProperty("postal_code")
    private String postalCode;
    @JsonProperty("right_1")
    private String right;
    @JsonProperty("right_number")
    private String rightNumber;
    @ReverseMapping("permitted_land_use_type")
    private List<String> permittedLandUseTypes;
    @JsonProperty("urban_development_potential")
    private String urbanDevelopmentPotential;
    @JsonProperty("cadastre_quarter_number")
    private String cadastreQuarterNumber;
    @JsonProperty("cost")
    private Double cadastreCost;

}
