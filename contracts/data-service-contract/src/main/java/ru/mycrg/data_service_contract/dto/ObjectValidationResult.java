package ru.mycrg.data_service_contract.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Класс используется для передачи через очередь и для вывода инфы на UI. Если на UI не хочется получать лишней инфы
 * (типа поля xMin) то нуно заюзать отдельную DTO В данном классе никаких JsonIgnore не тыкать
 */
public class ObjectValidationResult {

    private String objectId;
    private String globalId;
    private String classId;
    private String xMin;
    private List<PropertyViolation> propertyViolations = new ArrayList<>();
    private final List<ErrorDescription> objectViolations = new ArrayList<>();

    public void addPropertyViolation(PropertyViolation propertyViolation) {
        this.propertyViolations.add(propertyViolation);
    }

    public void addObjectViolation(ErrorDescription violation) {
        this.objectViolations.add(violation);
    }

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

    public String getGlobalId() {
        return globalId;
    }

    public void setGlobalId(String globalId) {
        this.globalId = globalId;
    }

    public List<PropertyViolation> getPropertyViolations() {
        return propertyViolations;
    }

    public void setPropertyViolations(List<PropertyViolation> propertyViolations) {
        this.propertyViolations = propertyViolations;
    }

    public String getxMin() {
        return xMin;
    }

    public void setxMin(String xMin) {
        this.xMin = xMin;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public List<ErrorDescription> getObjectViolations() {
        return objectViolations;
    }
}
