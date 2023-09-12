package ru.crg.gisogd_service.converter.mixin;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.converter.Reference2ADeserializer;
import ru.crg.gisogd_service.model.rf.DataSection15;

/**
 * Модель данных Document - dl_data_section15.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_section15", objectClass = DataSection15.class)
public class DataSection15Mixin {

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
    @JsonProperty("guid_doc_previous_version_fake")
    private List<String> guidDocPreviousVersion;
    @JsonProperty("org_name")
    private String orgName;
    @JsonProperty("territory_key")
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
    @JsonProperty("protectedNaturalAreas_fake")
    private List<String> protectedNaturalAreas;
}
