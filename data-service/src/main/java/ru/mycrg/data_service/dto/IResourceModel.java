package ru.mycrg.data_service.dto;

import java.time.LocalDateTime;

public interface IResourceModel {

    String getRole();

    void setRole(String role);

    String getTitle();

    void setTitle(String title);

    String getDetails();

    void setDetails(String details);

    String getIdentifier();

    void setIdentifier(String identifier);

    LocalDateTime getCreatedAt();

    void setCreatedAt(LocalDateTime createdAt);

    String getType();

    void setType(String type);

    Integer getItemsCount();

    void setItemsCount(Integer itemsCount);
}
