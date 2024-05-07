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

    private final String SRS_SEPARATOR = "\n";
    private final String SRS_ID_SEPARATOR = "=";

    public void addAndReload(SpatialReferenceSystem newSrs, String token) throws HttpClientException {
        log.info("Try add projection: {} With: {}", newSrs, token);

        CustomSrsService customSrsService = new CustomSrsService(token);
        ResponseModel<String> response = customSrsService.getCustomSrs();
        if (!response.isSuccessful()) {
            String msg = String.format("Не удалось получить системы координат с геосервера. => [%s] Code: %d",
                                       response.getMsg(), response.getCode());
            log.info(msg);

            throw new GisServiceException(msg);
        }

        String srsAsString = response.getBody();
        if (srsAsString == null) {
            throw new GisServiceException("Не удалось получить системы координат с геосервера");
        }

        Integer srid = newSrs.getAuthSrid();
        if (exists(srsAsString, srid)) {
            throw new ConflictException("Проекция: " + srid + " уже существует на геосервере");
        }

        // Все проверили можно добавлять и сохранять
        String resultSrs = srsAsString + SRS_SEPARATOR + buildSrs(newSrs);

        log.info("Result spatial reference systems: {}", resultSrs);

        // Update
        customSrsService.update(resultSrs);

        // Reload geoserver
        Executors.newSingleThreadExecutor()
                 .submit(() -> {
                     try {
                         log.info("Try reload configuration");

                         new ConfigurationService(token).reload();
                     } catch (Exception e) {
                         log.warn("Не удалось перезагрузить конфигурацию геосервера => {}",e.getMessage(), e);
                     }
                 });
    }

    private boolean exists(String srsAsString, Integer srid) {
        return Stream.of(srsAsString.split(SRS_SEPARATOR))
                     .map(srs -> srs.split(SRS_ID_SEPARATOR)[0])
                     .anyMatch(id -> id.equals(srid.toString()));
    }

    private String buildSrs(SpatialReferenceSystem srs) {
        return srs.getAuthSrid() + SRS_ID_SEPARATOR + srs.getSrtext();
    }
}
