package ru.mycrg.gis_service.service.geoserver;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.geoserver_client.contracts.datastores.VectorDataStore;
import ru.mycrg.geoserver_client.services.storage.vector.VectorStorage;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.exceptions.ThirdPartyServiceException;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.Map;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;

@Service
public class DataStoreService {

    private final Logger log = LoggerFactory.getLogger(DataStoreService.class);

    private final Environment environment;
    private final IAuthenticationFacade authenticationFacade;

    public DataStoreService(IAuthenticationFacade authenticationFacade,
                            Environment environment) {
        this.authenticationFacade = authenticationFacade;
        this.environment = environment;
    }

    public void create(String storeName) {
        try {
            log.debug("Try create storage {} on geoserver", storeName);

            Long orgId = authenticationFacade.getOrganizationId();
            String orgWorkspace = getScratchWorkspaceName(orgId);

            VectorStorage vectorStorage = new VectorStorage(authenticationFacade.getAccessToken());
            VectorDataStore dataStore = new VectorDataStore(storeName, prepareConnectionParameters(orgId, storeName));

            ResponseModel<Object> responseModel = vectorStorage.create(orgWorkspace, dataStore);
            if (!responseModel.isSuccessful()) {
                throw new ThirdPartyServiceException("Не удалось создать хранилище на геосервере", responseModel);
            }
        } catch (HttpClientException e) {
            throw new ThirdPartyServiceException("Не удалось создать хранилище на геосервере", e.getCause());
        }
    }

    public void delete(String storeName) {
        try {
            log.debug("Try delete storage {} on geoserver", storeName);

            String token = authenticationFacade.getAccessToken();
            String orgWorkspace = getScratchWorkspaceName(authenticationFacade.getOrganizationId());

            ResponseModel<Object> responseModel = new VectorStorage(token).delete(orgWorkspace, storeName);
            if (!responseModel.isSuccessful()) {
                if (responseModel.getCode() == NOT_FOUND.value()) {
                    throw new NotFoundException("На геосервере не найдено хранилище: " + storeName);
                } else {
                    throw new ThirdPartyServiceException("Не удалось удалить хранилище на геосервере", responseModel);
                }
            }
        } catch (HttpClientException e) {
            throw new ThirdPartyServiceException("Не удалось удалить хранилище на геосервере", e.getCause());
        }
    }

    @NotNull
    private Map<String, Object> prepareConnectionParameters(Long orgId, String dataStoreId) {
        String postGis = environment
                .getRequiredProperty("spring.datasource.url")
                .split("//")[1]
                .split("/")[0];

        return Map.of("host", postGis.split(":")[0],
                      "port", String.valueOf(Integer.parseInt(postGis.split(":")[1])),
                      "database", getDefaultDatabaseName(orgId),
                      "schema", dataStoreId,
                      "user", environment.getRequiredProperty("spring.datasource.username"),
                      "passwd", environment.getRequiredProperty("spring.datasource.password"));
    }
}
