package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.TelecomNetwork;

/**
 * Модель данных из telecom_network.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "telecom_network", objectClass = TelecomNetwork.class)
public class TelecomNetworkMixin {

    @JsonProperty("guid_telecom_network")
    private String guid;
    @JsonProperty("class")
    private String propertyClass;
    @JsonProperty("object_name")
    private String objectName;
    @JsonProperty("location_info")
    private String locationInfo;
    @JsonProperty("number")
    private String number;
    @JsonProperty("lenght")
    private Double length;
    @JsonProperty("status")
    private String status;
    @JsonProperty("deterioration_percent")
    private Double deteriorationPercent;
    @JsonProperty("ownership_type")
    private String ownershipType;
    @JsonProperty("balance_hoder")
    private String balanceHolder;
    @JsonProperty("completion_year")
    private String completionYear;
    @JsonProperty("reconstruction_year")
    private String reconstructionYear;
    @JsonProperty("zone_size")
    private Double zoneSize;
    @JsonProperty("comm_line_type")
    private String commLineType;
    @ReverseMapping(skipcheck = true, value = "datasource_fake")
    private String dataSource;
    @JsonProperty("object_grade")
    private String objectGrade;
    @JsonProperty("telecom_network_type")
    private String telecomNetworkType;
}
