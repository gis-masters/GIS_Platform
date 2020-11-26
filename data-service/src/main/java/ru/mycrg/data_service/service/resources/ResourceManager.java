package ru.mycrg.data_service.service.resources;

public interface ResourceManager {

    void create(ResourceIdentifier rIdentifier);

    boolean isExist(ResourceIdentifier rIdentifier);

    void delete(ResourceIdentifier rIdentifier);
}
