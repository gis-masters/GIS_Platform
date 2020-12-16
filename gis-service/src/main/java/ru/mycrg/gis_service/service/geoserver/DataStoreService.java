package ru.mycrg.gis_service.service.geoserver;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.storage.vector.ConnectionParameters;
import ru.mycrg.geoserver_client.services.storage.vector.DataStore;
import ru.mycrg.geoserver_client.services.storage.vector.VectorStorage;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.exceptions.ThirdPartyServiceException;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static ru.mycrg.gis_service.security.CrgAuthHelper.getToken;
import static ru.mycrg.gis_service.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_DB_NAME;

@Service
public class DataStoreService {

    public static final Logger log = LoggerFactory.getLogger(DataStoreService.class);

    private final Environment environment;

    public DataStoreService(Environment environment) {
        this.environment = environment;
    }

    public void create(String dataStoreId, Authentication authentication) {
        String accessToken = getToken(authentication);
        Long orgId = getOrganizationId(authentication);

        try {
            log.debug("Try create storage {} on geoserver", dataStoreId);

            final String orgWorkspace = "scratch_database_" + orgId;
            ResponseModel<Object> responseModel = new VectorStorage(accessToken)
                    .create(orgWorkspace, new DataStore(dataStoreId, prepareConnectionParameters(orgId, dataStoreId)));
            if (!responseModel.isSuccessful()) {
                throw new ThirdPartyServiceException("Не удалось создать хранилище на геосервере", responseModel);
            }
        } catch (HttpClientException e) {
            throw new ThirdPartyServiceException("Не удалось создать хранилище на геосервере", e.getCause());
        }
    }

    public void delete(String dataStoreId, Authentication authentication) {
        try {
            log.debug("Try delete storage {} on geoserver", dataStoreId);

            String accessToken = getToken(authentication);
            Long orgId = getOrganizationId(authentication);

            final String orgWorkspace = "scratch_database_" + orgId;
            ResponseModel<Object> responseModel = new VectorStorage(accessToken).delete(orgWorkspace, dataStoreId);
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

        String dbName = DEFAULT_DB_NAME + orgId;
        String dbHost = postGis.split(":")[0];
        int dbPort = Integer.parseInt(postGis.split(":")[1]);
        String dbOwner = environment.getRequiredProperty("spring.datasource.username");
        String dbPass = environment.getRequiredProperty("spring.datasource.password");

        return new ConnectionParameters(dbHost, String.valueOf(dbPort), dbName, dataStoreId, dbOwner, dbPass, "postgis");
    }
}
