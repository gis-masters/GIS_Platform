package ru.mycrg.wrapper.geoserver_client.services;

import ru.mycrg.wrapper.geoserver_client.GeoserverClientException;

public interface IProject {

    void createProject(String projectName, Long orgId) throws GeoserverClientException;

    void deleteProject(String projectName);
}
