package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.InboxData;

import java.time.LocalDate;

/**
 * Модель данных из tasks InboxData.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_inbox_data", objectClass = InboxData.class)
public class InboxDataMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("number")
    private String number;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonProperty("date")
    private LocalDate date;
    @JsonProperty("person_name")
    private String personName;
    @JsonProperty("cover_letter_num")
    private String coverLetterNum;
    @JsonProperty("cover_letter_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDate coverLetterDate;
    @JsonProperty("request_type")
    private String requestType;
    @JsonProperty("is_name")
    private String isName;
    @JsonProperty("data_type")
    private String dataType;
    @JsonProperty("record_status")
    private String recordStatus;
    @JsonProperty("user_name")
    private String userName;
}
