package ru.crg.gisogd_service.converter.mixin;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.model.rf.ElementPlanningStructure;

/**
 * Модель данных  element_planning_structure.
 * @author Vladimir Nomokonov
 */
@CrimeaRelationResolve(nameStartWith = "element_planning_structure", objectClass = ElementPlanningStructure.class)
public class ElementPlanningStructureMixin {

    @JsonProperty("guid_element_planning_structure")
    private String guid;
    @JsonProperty("class")
    private String propertyClass;
    @JsonProperty("status")
    private String status;
    @JsonProperty("number")
    private Integer number;
    @JsonProperty("area")
    private Double area;
    @JsonProperty("note")
    private String note;
    @JsonProperty("shape")
    private String location;
}
