package ru.crg.gisogd_service.converter.mixin;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.FormedLand;

/**
 * Модель данных Document - formed_land.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "formed_land", objectClass = FormedLand.class)
public class FormedLandMixin {

    @JsonProperty("guid_formed_land")
    private String guid;
    @JsonProperty("class")
    private String propertyClass;
    @JsonProperty("status")
    private String status;
    @JsonProperty("forming_type")
    private String formingType;
    @JsonProperty("nominal_num")
    private String nominalNum;
    @JsonProperty("location_info")
    private String locationInfo;
    @JsonProperty("area")
    private Double area;
    @JsonProperty("permittedUseType_fake")
    private List<String> permittedUseType;
    @JsonProperty("easement")
    private String easement;
    @JsonProperty("shape")
    private String location;
}
