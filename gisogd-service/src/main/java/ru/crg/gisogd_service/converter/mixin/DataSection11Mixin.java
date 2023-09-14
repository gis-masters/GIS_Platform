package ru.crg.gisogd_service.converter.mixin;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.converter.Reference2ADeserializer;
import ru.crg.gisogd_service.model.rf.DataSection11;

/**
 * Модель dl_data_section11.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_section11", objectClass = DataSection11.class)
public class DataSection11Mixin {

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
    @ReverseMapping(value = "powerLines", skipcheck = true)
    private String powerLines;
    @ReverseMapping(value = "pipeline", skipcheck = true)
    private String pipeline;
    @ReverseMapping(value = "waterDisposalObject", skipcheck = true)
    private String waterDisposalObject;
    @ReverseMapping(value = "waterSupplyObject", skipcheck = true)
    private String waterSupplyObject;
    @ReverseMapping(value = "gasSupplyObject", skipcheck = true)
    private String gasSupplyObject;
    @ReverseMapping(value = "oilSupplyObject", skipcheck = true)
    private String oilSupplyObject;
    @ReverseMapping(value = "communicationObject", skipcheck = true)
    private String communicationObject;
    @ReverseMapping(value = "heatSupplyObject", skipcheck = true)
    private String heatSupplyObject;
    @ReverseMapping(value = "electricPowerObject", skipcheck = true)
    private String electricPowerObject;
    @ReverseMapping(value = "gasPipeline", skipcheck = true)
    private String gasPipeline;
    @ReverseMapping(value = "waterDisposalNetwork", skipcheck = true)
    private String waterDisposalNetwork;
    @ReverseMapping(value = "waterSupplyNetwork", skipcheck = true)
    private String waterSupplyNetwork;
    @ReverseMapping(value = "heatSupplyNetwork", skipcheck = true)
    private String heatSupplyNetwork;
    @ReverseMapping(value = "telecomNetwork", skipcheck = true)
    private String telecomNetwork;
    @ReverseMapping(value = "utilityConnectionPoint", skipcheck = true)
    private String utilityConnectionPoint;
    @ReverseMapping(value = "liquidPipeline", skipcheck = true)
    private String liquidPipeline;
    @JsonProperty("note")
    private String note;

}

