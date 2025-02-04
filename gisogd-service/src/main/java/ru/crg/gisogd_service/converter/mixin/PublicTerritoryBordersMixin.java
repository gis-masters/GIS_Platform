package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.PublicTerritoryBorders;

/**
 * Модель данных  public_territory_borders.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "public_territory_borders", objectClass = PublicTerritoryBorders.class)
public class PublicTerritoryBordersMixin {

    @JsonProperty("guid_public_territory_borders")
    private String guid;
    @JsonProperty("class")
    private String propertyClass;
    @JsonProperty("status")
    private String status;
    @JsonProperty("area")
    private Double area;
    @JsonProperty("shape")
    private String location;
}
