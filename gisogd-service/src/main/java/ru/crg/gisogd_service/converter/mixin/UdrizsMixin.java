package ru.crg.gisogd_service.converter.mixin;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.UDRIZS;

/**
 * Модель данных Document - dl_data_udrizs.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_udrizs", objectClass = UDRIZS.class)
public class UdrizsMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("dl_data_section13_data_connection")
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
    @JsonProperty("notification_requisites")
    private String notificationRequisites;
    @JsonProperty("living_area")
    private Double livingArea;
    @JsonProperty("applications")
    private String applications;
    @JsonProperty("parameter_mismatch")
    private String parameterMismatch;
    @JsonProperty("placement_mismatch")
    private String placementMismatch;
    @JsonProperty("customer_mismatch")
    private String customerMismatch;
    @JsonProperty("appearance_mismatch")
    private String appearanceMismatch;
}
