package ru.mycrg.wrapper.geoserver_client;

import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;

import java.io.IOException;
import java.sql.SQLException;

@Service
public class GeoserverClientFacadeImpl implements IGeoserverClientFacade {

    @Override
    public void createOrganization(BaseMqProcessRequest mqRequest) throws IOException, RuntimeException {

    }

    @Override
    public void createProject(BaseMqProcessRequest mqRequest) throws IOException, RuntimeException, SQLException {

    }

    @Override
    public void deleteProject(BaseMqProcessRequest mqRequest) {

    }
}
