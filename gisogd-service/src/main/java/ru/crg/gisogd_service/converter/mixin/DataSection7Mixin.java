package ru.crg.gisogd_service.converter.mixin;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.converter.Reference2ADeserializer;
import ru.crg.gisogd_service.model.rf.DataSection7;

/**
 * Модель dl_data_section7.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_section7", objectClass = DataSection7.class)
public class DataSection7Mixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("content_type_id")
    @JsonDeserialize(using = Reference2ADeserializer.class)
    private String classid;
    @JsonProperty("docstatus")
    private String docStatus;
    @JsonProperty("docname")
    private String docName;
    @JsonProperty("docnum")
    private String docNum;
    @JsonProperty("docdate")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate docDate;
    @JsonProperty("guiddocpreviousversion_fake")
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
    @JsonProperty("note")
    private String note;
    @JsonProperty("elementPlanningStructure_fake")
    private List<String> elementPlanningStructure;
    @JsonProperty("publicTerritoryBorders_fake")
    private List<String> publicTerritoryBorders;
    @JsonProperty("constructionZonesBorders_fake")
    private List<String> constructionZonesBorders;
    @JsonProperty("redLine_fake")
    private List<String> redLine;
    @JsonProperty("formedLand_fake")
    private List<String> formedLand;
    @JsonProperty("indentLine_fake")
    private List<String> indentLine;
    @JsonProperty("easement_fake")
    private List<String> easement;

}

