package ru.crg.gisogd_service.converter.mixin;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.TechPlan;

/**
 * Модель данных Document - dl_data_tech_plan.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_tech_plan", objectClass = TechPlan.class)
public class TechPlanMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("title")
    private String title;
    @JsonProperty("issue_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate issueDate;
    @JsonProperty("cadastre_engineer_full_name")
    private String cadastreEngineerFullName;
    @JsonProperty("cadastre_engineer_certificate_organization")
    private String cadastreEngineerCertificateOrganization;
    @JsonProperty("cadastre_engineer_certificate_number")
    private String cadastreEngineerCertificateNumber;
    @JsonProperty("cadastre_engineer_certificate_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate cadastreEngineerCertificateDate;
    @JsonProperty("cadastre_engineer_registry_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate cadastreEngineerRegistryDate;
    @JsonProperty("snils_cadaster_engineer")
    private String snILSCadasterEngineer;

}
