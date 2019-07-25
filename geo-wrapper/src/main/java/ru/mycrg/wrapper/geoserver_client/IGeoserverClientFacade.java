package ru.mycrg.wrapper.geoserver_client;

import ru.mycrg.common.OrgMqProcessRequest;

import java.io.IOException;
import java.util.Optional;

public interface IGeoserverClientFacade {

    Optional authorize() throws IOException;

    void createOrganization(OrgMqProcessRequest mqRequest) throws IOException, RuntimeException;

    void createProject(String projectName, Long orgId) throws IOException, RuntimeException;

    void deleteProject(String projectName);
}
