package ru.mycrg.geoserver_client.services.projects;

import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;

public interface IProject {

    void createProject(String projectName, Long orgId) throws GeoserverClientException;

    void deleteProject(String projectName) throws GeoserverClientException;
}
