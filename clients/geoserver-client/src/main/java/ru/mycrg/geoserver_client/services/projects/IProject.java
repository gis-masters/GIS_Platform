package ru.mycrg.geoserver_client.services.projects;

import ru.mycrg.http_client.exceptions.HttpClientException;

public interface IProject {

    void createProject(String projectName, Long orgId) throws HttpClientException;

    void deleteProject(String projectName) throws HttpClientException;
}
