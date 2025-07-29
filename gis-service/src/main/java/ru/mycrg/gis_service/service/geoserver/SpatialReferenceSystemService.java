package ru.mycrg.gis_service.service.geoserver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;
import ru.mycrg.geoserver_client.services.configuration.ConfigurationService;
import ru.mycrg.geoserver_client.services.srs.CustomSrsService;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.concurrent.Executors;
import java.util.stream.Stream;

@Service
public class SpatialReferenceSystemService {

    private static final Logger log = LoggerFactory.getLogger(SpatialReferenceSystemService.class);

    private static final String SRS_SEPARATOR = "\n";
    private static final String SRS_ID_SEPARATOR = "=";
    private static final String SRS_FETCH_ERROR_MSG = "Не удалось получить системы координат с геосервера";

    public void addAndReload(SpatialReferenceSystem newSrs, String token) throws HttpClientException {
        log.info("Try add projection: {} With: {}", newSrs, token);

        String currentSrs = getCurrentSrs(token);
        Integer srid = newSrs.getAuthSrid();

        if (exists(currentSrs, srid)) {
            throw new ConflictException("Проекция: " + srid + " уже существует на геосервере");
        }

        String resultSrs = currentSrs + SRS_SEPARATOR + buildSrs(newSrs);
        log.info("Result spatial reference systems: {}", resultSrs);

        updateSrsAndReload(resultSrs, token, "Try reload configuration", true);
    }

    public void deleteAndReload(SpatialReferenceSystem srsToDelete, String token, boolean needToReload)
            throws HttpClientException {
        log.info("Try delete projection: {} With: {}", srsToDelete.getAuthSrid(), token);

        String currentSrs = getCurrentSrs(token);
        Integer srid = srsToDelete.getAuthSrid();

        if (!exists(currentSrs, srid)) {
            log.warn("Проекция: {} не найдена на геосервере", srid);
            return; // Не выбрасываем исключение, так как цель достигнута - проекции нет
        }

        String resultSrs = removeSrsFromString(currentSrs, srid);
        log.info("Result spatial reference systems after deletion: {}", resultSrs);

        updateSrsAndReload(resultSrs, token, "Try reload configuration after deletion", needToReload);
    }

    private String getCurrentSrs(String token) throws HttpClientException {
        CustomSrsService customSrsService = new CustomSrsService(token);
        ResponseModel<String> response = customSrsService.getCustomSrs();

        if (!response.isSuccessful()) {
            String msg = String.format("%s. => [%s] Code: %d",
                                       SRS_FETCH_ERROR_MSG, response.getMsg(), response.getCode());
            log.info(msg);
            throw new GisServiceException(msg);
        }

        String srsAsString = response.getBody();
        if (srsAsString == null) {
            throw new GisServiceException(SRS_FETCH_ERROR_MSG);
        }

        return srsAsString;
    }

    private void updateSrsAndReload(String resultSrs, String token, String reloadLogMessage, boolean needToReload)
            throws HttpClientException {
        CustomSrsService customSrsService = new CustomSrsService(token);
        customSrsService.update(resultSrs);
        if (needToReload) {
            reloadConfigurationAsync(token, reloadLogMessage);
        }
    }

    private void reloadConfigurationAsync(String token, String logMessage) {
        Executors.newSingleThreadExecutor()
                 .submit(() -> {
                     try {
                         log.info(logMessage);
                         new ConfigurationService(token).reload();
                     } catch (Exception e) {
                         log.warn("Не удалось перезагрузить конфигурацию геосервера => {}", e.getMessage(), e);
                     }
                 });
    }

    private boolean exists(String srsAsString, Integer srid) {
        return Stream.of(srsAsString.split(SRS_SEPARATOR))
                     .map(srs -> srs.split(SRS_ID_SEPARATOR)[0])
                     .anyMatch(id -> id.equals(srid.toString()));
    }

    private String removeSrsFromString(String srsAsString, Integer sridToRemove) {
        return Stream.of(srsAsString.split(SRS_SEPARATOR))
                     .filter(srs -> !srs.split(SRS_ID_SEPARATOR)[0].equals(sridToRemove.toString()))
                     .reduce((a, b) -> a + SRS_SEPARATOR + b)
                     .orElse("");
    }

    private String buildSrs(SpatialReferenceSystem srs) {
        return srs.getAuthSrid() + SRS_ID_SEPARATOR + srs.getSrtext();
    }
}
