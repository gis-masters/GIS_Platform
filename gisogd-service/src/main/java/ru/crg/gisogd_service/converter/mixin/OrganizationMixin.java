package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.Organization;

import java.time.LocalDate;

/**
 * Модель данных Document - Organization.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_organization", objectClass = Organization.class)
public class OrganizationMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("title")
    private String title;
    @JsonProperty("full_title")
    private String fullTitle;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonProperty("regdate")
    private LocalDate regDate;
    @JsonProperty("legal_address")
    private String legalAddress;
    @JsonProperty("actual_address")
    private String actualAddress;
    @JsonProperty("correspondence_address")
    private String correspondenceAddress;
    @JsonProperty("contactinfo")
    private String contactInfo;
    @JsonProperty("url_address")
    private String urLAddress;
    @JsonProperty("director")
    private String director;
    @JsonProperty("phone")
    private String phone;
    @JsonProperty("email")
    private String email;
    @JsonProperty("inn")
    private String INN;
    @JsonProperty("kpp")
    private String KPP;
    @JsonProperty("okved")
    private String OKVED;
    @JsonProperty("okato")
    private String OKATO;
    @JsonProperty("orgn")
    private String OGRN;
    @JsonProperty("bank")
    private String bank;
    @JsonProperty("pay_account")
    private String payAccount;
    @JsonProperty("corr_account")
    private String corrAccount;
    @JsonProperty("description")
    private String description;
    @JsonProperty("supplier_guid")
    private String supplierGuid;
}
