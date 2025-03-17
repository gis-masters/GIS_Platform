package ru.mycrg.common_contracts.generated.gis_service.project;

public class ProjectCreateDto extends ProjectUpdateDto {

    private boolean isDefault;
    private boolean isFolder;
    private Long parentId;

    public ProjectCreateDto() {
        // Required
    }

    public ProjectCreateDto(String name) {
        this(name, null, null, false, false, null);
    }

    public ProjectCreateDto(String name, String description, String bbox) {
        this(name, description, bbox, false, false, null);
    }

    public ProjectCreateDto(String name, String description, String bbox, boolean isDefault) {
        super(name, description, bbox);

        this.isDefault = isDefault;
    }

    public ProjectCreateDto(String name, String des, String bbox, boolean isDefault, boolean isFolder, Long parentId) {
        super(name, des, bbox);

        this.isDefault = isDefault;
        this.isFolder = isFolder;
        this.parentId = parentId;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        this.isDefault = aDefault;
    }

    public boolean isFolder() {
        return isFolder;
    }

    public void setFolder(boolean folder) {
        isFolder = folder;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"name\":" + (getName() == null ? "null" : "\"" + getName() + "\"") + ", " +
                "\"bbox\":" + (getBbox() == null ? "null" : "\"" + getBbox() + "\"") + ", " +
                "\"description\":" + (getDescription() == null ? "null" : "\"" + getDescription() + "\"") +
                "\"isDefault\":\"" + isDefault + "\"" + ", " +
                "\"isFolder\":\"" + isFolder + "\"" + ", " +
                "\"parentId\":" + (parentId == null ? "null" : "\"" + parentId + "\"") +
                "}";
    }
}
