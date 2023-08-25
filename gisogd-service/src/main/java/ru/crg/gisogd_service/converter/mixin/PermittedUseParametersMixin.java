package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.PermittedUseParameters;

/**
 * Модель данных Document - PermittedUseParameters.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_permitted_use_parameters", objectClass = PermittedUseParameters.class)
public class PermittedUseParametersMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("permitted_use_parameter_type")
    private String permittedUseParameterType;
    @JsonProperty("value")
    private String value;
    @JsonProperty("other_values")
    private String otherValues;
}
