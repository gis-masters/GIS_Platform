package ru.crg.gisogd_service.converter.mixin;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
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
    @JsonProperty("note")
    private String note;
    @ReverseMapping("element_planning_structure")
    private List<String> elementPlanningStructure;
    @ReverseMapping("public_territory_borders")
    private List<String> publicTerritoryBorders;
    @ReverseMapping(value = "constructionZonesBorders", skipcheck = true)
    private List<String> constructionZonesBorders;
    @ReverseMapping("red_line_line")
    private List<String> redLine;
    @ReverseMapping("formed_land")
    private List<String> formedLand;
    @ReverseMapping("indent_line")
    private List<String> indentLine;
    @ReverseMapping(value = "easement", skipcheck = true)
    private List<String> easement;

}

