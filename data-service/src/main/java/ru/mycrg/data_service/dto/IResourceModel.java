package ru.mycrg.data_service.dto;

public interface IResourceModel {

    Long getId();

    String getRole();

    void setRole(String role);

    String getTitle();

    void setTitle(String title);

    String getDetails();

    void setDetails(String details);

    String getIdentifier();

    void setIdentifier(String identifier);

    String getCreatedAt();

    void setCreatedAt(String createdAt);

    String getType();

    void setType(String type);

    Integer getItemsCount();

    void setItemsCount(Integer itemsCount);

    String getCrs();

    String getSchemaId();

    String getTableName();

    default boolean isCompatibleByCrs(IResourceModel otherTable) {
        return getCrs().equalsIgnoreCase(otherTable.getCrs());
    }
}
