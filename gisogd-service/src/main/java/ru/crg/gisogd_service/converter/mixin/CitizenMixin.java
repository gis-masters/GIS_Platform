package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.Citizen;

/**
 * Модель данных Document - Citizen.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_citizen", objectClass = Citizen.class)
public class CitizenMixin {
    @JsonProperty("guid")
    private String guid;
    @JsonProperty("title")
    private String title;

}
