package ru.mycrg.wrapper.service;

import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.geoserver_client.IGeoserverClientFacade;

import java.io.IOException;
import java.sql.SQLException;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;

@Service
public class SomeService {

    private final IGeoserverClientFacade geoserverClient;
    private final BaseDaoService baseDaoService;

    public SomeService(IGeoserverClientFacade geoserverClient,
                       BaseDaoService baseDaoService) {
        this.geoserverClient = geoserverClient;
        this.baseDaoService = baseDaoService;
    }

    public void createOrganization(BaseMqProcessRequest mqRequest) {
        try {
            geoserverClient.createOrganization(mqRequest);

            baseDaoService.createDb(DEFAULT_DB_NAME + "fromRequest");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void createProject(BaseMqProcessRequest mqRequest) {
        try {
            geoserverClient.createProject(mqRequest);

            baseDaoService.initP10Template(DEFAULT_DB_NAME + "some", "somePName");
        } catch (IOException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteProject(BaseMqProcessRequest mqRequest) {
        // TODO
    }

}
