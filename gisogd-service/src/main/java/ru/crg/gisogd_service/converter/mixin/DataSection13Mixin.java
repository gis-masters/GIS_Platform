package ru.crg.gisogd_service.converter.mixin;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.converter.Reference2ADeserializer;
import ru.crg.gisogd_service.model.rf.DataSection13;
import ru.crg.gisogd_service.model.rf.ServiceStatus;

/**
 * Модель dl_data_section13.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_section13", objectClass = DataSection13.class)
public class DataSection13Mixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("content_type_id")
    @JsonDeserialize(using = Reference2ADeserializer.class)
    private String classid;
    @JsonProperty("docstatus")
    private String docStatus;
    @JsonProperty("title")
    private String docName;
    @JsonProperty("docnum")
    private String docNum;
    @JsonProperty("docdate")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate docDate;
    @ReverseMapping("guiddocpreviousversion")
    private List<String> guidDocPreviousVersion;
    @JsonProperty("orgname")
    private String orgName;
    @JsonProperty("territorykey")
    private String territoryKey;
    @JsonProperty("inbox_data_key_data_connection")
    private String inboxDataKey;
    @JsonProperty("regnum")
    private String regNum;
    @JsonProperty("regdate")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate regDate;
    @JsonProperty("supplieremploey_data_connection")
    private String supplierEmployee;
    @JsonProperty("last_modified")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate changeDate;
    @JsonProperty("constructiontype")
    private String constructionType;
    @JsonProperty("service_status")
    private ServiceStatus serviceStatus;
    @JsonProperty("namefrompd")
    private String nameFromPD;
    @JsonProperty("developer")
    private String developer;
    @JsonProperty("validuntil")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate validUntil;
    @JsonProperty("termination_reason")
    private String terminationReason;
    @JsonProperty("egrzdate")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate egRZDate;
    @JsonProperty("note")
    private String note;
    @ReverseMapping(value = "landplot", skipcheck = true)
    private List<String> landPlot;
    @ReverseMapping(value = "oks", skipcheck = true)
    private List<String> oks;
    @ReverseMapping(value = "easement", skipcheck = true)
    private List<String> easement;
    @JsonProperty("location")
    private String location;
    @ReverseMapping(value = "description", skipcheck = true)
    private String description;
}

