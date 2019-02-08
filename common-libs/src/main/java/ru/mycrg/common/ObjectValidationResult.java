package ru.mycrg.common;

import java.util.ArrayList;
import java.util.List;

/**
 * Класс используется для передачи через очередь и для вывода инфы на UI.
 * Если на UI не хочется получать лишней инфы (типа поля xMin) то нуно заюзать отдельную DTO
 * В данном классе никаких JsonIgnore не тыкать
 */
public class ObjectValidationResult {

    private String objectId;

    private String xMin;

    private List<PropertyViolation> violations = new ArrayList<>();
    private List<String> correctProperties = new ArrayList<>();

    public ObjectValidationResult() {}

    public void addPropertyViolation(PropertyViolation propertyViolation) {
        this.violations.add(propertyViolation);
    }

    public void addCorrectProperty(String name) {
        this.correctProperties.add(name);
    }

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

    public List<PropertyViolation> getViolations() {
        return violations;
    }

    public List<String> getCorrectProperties() {
        return correctProperties;
    }

    public void setViolations(List<PropertyViolation> violations) {
        this.violations = violations;
    }

    public String getxMin() {
        return xMin;
    }

    public void setxMin(String xMin) {
        this.xMin = xMin;
    }
}
