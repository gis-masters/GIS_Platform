package ru.mycrg.wrapper.geoserver_client;

import ru.mycrg.common.BaseMqProcessRequest;

import java.io.IOException;
import java.sql.SQLException;

public interface IGeoserverClientFacade {

    void createOrganization(BaseMqProcessRequest mqRequest) throws IOException, RuntimeException;

    void createProject(BaseMqProcessRequest mqRequest) throws IOException, RuntimeException, SQLException;
    void deleteProject(BaseMqProcessRequest mqRequest);
}
