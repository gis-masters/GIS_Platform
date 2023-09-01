package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.CommunicationObject;

/**
 * Модель данных из communication_object.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "communication_object", objectClass = CommunicationObject.class)
public class CommunicationObjectMixin {

    @JsonProperty("guid_communication_object_point")
    @JsonAlias({"guid_communication_object_point", "guid_communication_object"})
    private String guid;
    @JsonProperty("class")
    private String propertyClass;
    @JsonProperty("status")
    private String status;
    @JsonProperty("ownership_type")
    private String ownershipType;
    @JsonProperty("object_grade")
    private String objectGrade;
    @JsonProperty("comm_line_type")
    private String commLineType;
    @JsonProperty("object_name")
    private String objectName;
    @JsonProperty("location_info")
    private String locationInfo;
    @JsonProperty("number")
    private String number;
    @JsonProperty("actual_use")
    private Double actualUse;
    @JsonProperty("capacity")
    private Integer capacity;
    @JsonProperty("power")
    private Double power;
    @JsonProperty("power_unit")
    private String powerUnit;
    @JsonProperty("data_rate")
    private Double dataRate;
    @JsonProperty("max_zone_distance")
    private Double maxZoneDistance;
    @JsonProperty("zone_border_height")
    private Double zoneBorderHeight;
    @JsonProperty("deterioration_percent")
    private Double deteriorationPercent;
    @JsonProperty("balance_hoder")
    private String balanceHolder;
    @JsonProperty("completion_year")
    private String completionYear;
    @JsonProperty("reconstruction_year")
    private String reconstructionYear;
    @JsonProperty("datasource_fake")
    private String dataSource;
}
