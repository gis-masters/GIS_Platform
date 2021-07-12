package ru.mycrg.data_service.service.resources;

public interface ResourceManager {

    void create(ResourceQualifier rIdentifier);

    boolean isExist(ResourceQualifier rIdentifier);

    void delete(ResourceQualifier rIdentifier);
}
