package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.GPZUInfoP6;

/**
 * Модель данных Document - dl_data_gpzu_info_p6.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_gpzu_info_p6", objectClass = GPZUInfoP6.class)
public class GpzuInfoP6Mixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("gpzu_fake")
    private String GPZU;
    @JsonProperty("title")
    private String title;
    @JsonProperty("border_fake")
    private String border;
}
