package ru.mycrg.common_contracts.generated.gis_service.project;

/**
 * Менять напрямую можно только эти параметры.
 * <p>
 * isDefault - нельзя менять, должен быть отдельный метод, который гарантирует только один проект по-умолчанию.
 * <p>
 * isFolder - нельзя допустить, чтобы просто так проект становился папкой или наоборот.
 * <p>
 * parentId - нельзя просто так менять родителя. Для этого предусмотрен отдельный метод перемещения.
 */
public class ProjectUpdateDto {

    private String name;
    private String bbox;
    private String description;

    public ProjectUpdateDto() {
        // Required
    }

    public ProjectUpdateDto(String name) {
        this(name, null, null);
    }

    public ProjectUpdateDto(String name, String description, String bbox) {
        this.name = name;
        this.bbox = bbox;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBbox() {
        return bbox;
    }

    public void setBbox(String bbox) {
        this.bbox = bbox;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "{" +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"bbox\":" + (bbox == null ? "null" : "\"" + bbox + "\"") + ", " +
                "\"description\":" + (description == null ? "null" : "\"" + description + "\"") +
                "}";
    }
}
