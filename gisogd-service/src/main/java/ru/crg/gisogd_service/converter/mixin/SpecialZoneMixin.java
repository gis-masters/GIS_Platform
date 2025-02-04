package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.SpecialZone;

/**
 * Модель данных Document - specialzone_xxx.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "specialzone", objectClass = SpecialZone.class)
public class SpecialZoneMixin {

    @JsonProperty("guid_special_zone")
    private String guid;
    @JsonProperty("class")
    private String propertyClass;
    @JsonProperty("numberzone")
    private String numberZone;
    @JsonProperty("objectname")
    private String objectName;
    @JsonProperty("codezonedoc")
    private String codeZoneDoc;
    @JsonProperty("index")
    private String index;
    @JsonProperty("document")
    private String document;
    @JsonProperty("area")
    private Double area;
    @JsonProperty("restrictions")
    private String restrictions;
    @JsonProperty("shape")
    private String location;
}
