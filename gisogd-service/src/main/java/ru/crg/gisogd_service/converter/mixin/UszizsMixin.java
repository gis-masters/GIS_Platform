package ru.crg.gisogd_service.converter.mixin;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.USZIZS;

/**
 * Модель данных Document - dl_data_uszizs.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_uszizs", objectClass = USZIZS.class)
public class UszizsMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("dataSection13_fake")
    @ReverseMapping("dl_data_section13_data_connection")
    private String dataSection13;
    @JsonProperty("is_approved")
    private Boolean isApproved;
    @JsonProperty("notification_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate notificationDate;
    @JsonProperty("registration_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate registrationDate;
    @JsonProperty("registration_number")
    private String registrationNumber;
    @JsonProperty("living_area")
    private Double livingArea;
    @JsonProperty("reconstructed")
    private Boolean reconstructed;
    @JsonProperty("izs_garden_house")
    private Boolean izSGardenHouse;
    @JsonProperty("parameter_mismatch")
    private String parameterMismatch;
    @JsonProperty("appearance_mismatch")
    private String appearanceMismatch;
    @JsonProperty("permitted_use_mismatch")
    private String permittedUseMismatch;
    @JsonProperty("placement_mismatch")
    private String placementMismatch;
}
