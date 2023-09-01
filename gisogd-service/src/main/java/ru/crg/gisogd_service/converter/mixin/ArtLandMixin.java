package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.ArtLand;

/**
 * Модель данных из tasks artland.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "artland", objectClass = ArtLand.class)
public class ArtLandMixin {

    @JsonProperty("guid_art_land")
    private String guid;
    @JsonProperty("waterobjectname")
    private String waterObjectName;
    @JsonProperty("location_info")
    private String locationInfo;
    @JsonProperty("area")
    private Double area;
    @JsonProperty("shape")
    private String location;
}
