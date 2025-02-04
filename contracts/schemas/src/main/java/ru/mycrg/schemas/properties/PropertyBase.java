package ru.mycrg.schemas.properties;

public class PropertyBase extends SystemRequired {

    private String description;
    private String category;
    private boolean isSystemManaged;
    private boolean hidden;
    private boolean disabled;
    private boolean required;
    private boolean asTitle;
    private boolean isIndexed;

    public PropertyBase() {
        super();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isSystemManaged() {
        return isSystemManaged;
    }

    public void setSystemManaged(boolean systemManaged) {
        isSystemManaged = systemManaged;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    public boolean isDisabled() {
        return disabled;
    }

    public void setDisabled(boolean disabled) {
        this.disabled = disabled;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public boolean isAsTitle() {
        return asTitle;
    }

    public void setAsTitle(boolean asTitle) {
        this.asTitle = asTitle;
    }

    public boolean isIndexed() {
        return isIndexed;
    }

    public void setIndexed(boolean indexed) {
        isIndexed = indexed;
    }
}
