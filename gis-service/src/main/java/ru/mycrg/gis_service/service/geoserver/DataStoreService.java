package ru.mycrg.gis_service.service.geoserver;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.storage.vector.ConnectionParameters;
import ru.mycrg.geoserver_client.services.storage.vector.DataStore;
import ru.mycrg.geoserver_client.services.storage.vector.VectorStorage;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.exceptions.ThirdPartyServiceException;
import ru.mycrg.gis_service.security.IAuthenticationFacade;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;

@Service
public class DataStoreService {

    private static final Logger log = LoggerFactory.getLogger(DataStoreService.class);

    private final Environment environment;
    private final IAuthenticationFacade authenticationFacade;

    public DataStoreService(IAuthenticationFacade authenticationFacade,
                            Environment environment) {
        this.authenticationFacade = authenticationFacade;
        this.environment = environment;
    }

    public void create(String dataStoreId) {
        try {
            log.debug("Try create storage {} on geoserver", dataStoreId);

            final Long orgId = authenticationFacade.getOrganizationId();
            final String orgWorkspace = getScratchWorkspaceName(orgId);

            final VectorStorage vectorStorage = new VectorStorage(authenticationFacade.getAccessToken());
            final DataStore dataStore = new DataStore(dataStoreId, prepareConnectionParameters(orgId, dataStoreId));

            ResponseModel<Object> responseModel = vectorStorage.create(orgWorkspace, dataStore);
            if (!responseModel.isSuccessful()) {
                throw new ThirdPartyServiceException("Не удалось создать хранилище на геосервере", responseModel);
            }
        } catch (HttpClientException e) {
            throw new ThirdPartyServiceException("Не удалось создать хранилище на геосервере", e.getCause());
        }
    }

    public void delete(String dataStoreId) {
        try {
            log.debug("Try delete storage {} on geoserver", dataStoreId);

            final String token = authenticationFacade.getAccessToken();
            final String orgWorkspace = getScratchWorkspaceName(authenticationFacade.getOrganizationId());

            ResponseModel<Object> responseModel = new VectorStorage(token).delete(orgWorkspace, dataStoreId);
            if (!responseModel.isSuccessful()) {
                if (responseModel.getCode() == NOT_FOUND.value()) {
                    throw new NotFoundException(dataStoreId);
                } else {
                    throw new ThirdPartyServiceException("Не удалось удалить хранилище на геосервере", responseModel);
                }
            }
        } catch (HttpClientException e) {
            throw new ThirdPartyServiceException("Не удалось удалить хранилище на геосервере", e.getCause());
        }
    }

    @NotNull
    private ConnectionParameters prepareConnectionParameters(Long orgId, String dataStoreId) {
        String postGis = environment
                .getRequiredProperty("spring.datasource.url")
                .split("//")[1]
                .split("/")[0];

        String dbName = getDefaultDatabaseName(orgId);
        String dbHost = postGis.split(":")[0];
        int dbPort = Integer.parseInt(postGis.split(":")[1]);
        String dbOwner = environment.getRequiredProperty("spring.datasource.username");
        String dbPass = environment.getRequiredProperty("spring.datasource.password");

        return new ConnectionParameters(dbHost, String.valueOf(dbPort), dbName, dataStoreId, dbOwner, dbPass,
                                        "postgis");
    }
}
