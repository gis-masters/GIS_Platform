package ru.mycrg.wrapper.geoserver_client.services.projects;

import ru.mycrg.wrapper.geoserver_client.exceptions.GeoserverClientException;

public interface IProject {

    void createProject(String projectName, Long orgId) throws GeoserverClientException;

    void deleteProject(String projectName);
}
