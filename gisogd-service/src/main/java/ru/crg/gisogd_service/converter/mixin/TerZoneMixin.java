package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.TerZone;

/**
 * Модель данных Document - TerZone.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_terzone", objectClass = TerZone.class)
public class TerZoneMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("zone_index")
    private String zoneIndex;
    @JsonProperty("terzone_type")
    private String terZoneType;
}
