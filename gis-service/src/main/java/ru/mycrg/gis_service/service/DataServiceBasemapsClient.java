package ru.mycrg.gis_service.service;

import okhttp3.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.gis_service.dto.BaseMapCreateDto;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.geoserver_client.services.GeoServerBaseService.httpClient;

@Service
public class DataServiceBasemapsClient {

    private final IAuthenticationFacade authenticationFacade;
    private final URL dataServiceUrl;

    private final Logger log = LoggerFactory.getLogger(DataServiceBasemapsClient.class);

    public DataServiceBasemapsClient(IAuthenticationFacade authenticationFacade,
                                     Environment environment) throws MalformedURLException {
        this.authenticationFacade = authenticationFacade;
        dataServiceUrl = new URL(environment.getRequiredProperty("crg-options.data-service-url"));
    }

    public List<BaseMapCreateDto> getAllPluggable() {
        List<BaseMapCreateDto> baseMaps = new ArrayList<>();
        try {
            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                    .url(new URL(dataServiceUrl, "/basemaps/search/findBaseMapByPluggableToNewProjectIsTrue"))
                    .get()
                    .build();

            ResponseModel<HashMap> response = httpClient.handleRequest(request, HashMap.class);
            if (response.isSuccessful()) {
                Map<String, Object> body = response.getBody();
                Map<String, Object> elements = (Map<String, Object>) body.get("_embedded");
                List<Map<String, Object>> basemaps = (List<Map<String, Object>>) elements.get("basemaps");

                return convertMapToBaseMap(basemaps);
            }
        } catch (HttpClientException | MalformedURLException e) {
            String msg = String.format("Ошибка при получении подложек, включённых в проект. Причина: %s",
                                       e.getMessage());
            log.error(msg);

            return baseMaps;
        }

        return baseMaps;
    }

    private List<BaseMapCreateDto> convertMapToBaseMap(List<Map<String, Object>> basemapsToConvert) {
        List<BaseMapCreateDto> baseMaps = new ArrayList<>();
        basemapsToConvert.forEach(baseMap -> {
            BaseMapCreateDto dto = new BaseMapCreateDto();
            if (baseMap.containsKey("id")) {
                dto.setBaseMapId(Double.valueOf(baseMap.get("id").toString()).longValue());
            }

            if (baseMap.containsKey("position")) {
                dto.setPosition(Double.valueOf(baseMap.get("position").toString()).intValue());
            }

            if (baseMap.containsKey("title")) {
                dto.setTitle(String.valueOf(baseMap.get("title")));
            }

            baseMaps.add(dto);
        });

        return baseMaps;
    }
}
