package ru.crg.gisogd_service.converter.mixin;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.PermittedLandUseTypes;

/**
 * Модель данных Document - PermittedLandUseTypes.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "dl_data_permitted_land_use_types", objectClass = PermittedLandUseTypes.class)
public class PermittedLandUseTypesMixin {

    @JsonProperty("guid")
    private String guid;
    @JsonProperty("permitted_land_use_species")
    private String permittedLandUseSpecies;
    @JsonProperty("permitted_land_use_type")
    private String permittedLandUseType;
    @ReverseMapping("permitted_use_parameters")
    private List<String> permittedUseParameters;
    @JsonProperty("use_restrictions")
    private String useRestrictions;
}
