package ru.mycrg.gis_service.service;

import okhttp3.Request;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.gis_service.dto.BaseMapCreateDto;
import ru.mycrg.http_client.ResponseModel;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
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

            ResponseModel<List> response = httpClient.handleRequest(request, List.class);
            if (response.isSuccessful()) {
                return convertMapToBaseMap(response.getBody());
            }
        } catch (Exception e) {
            String msg = String.format("Ошибка при получении подложек, включённых в проект. Причина: %s",
                                       e.getMessage());
            log.error(msg);

            return baseMaps;
        }

        return baseMaps;
    }

    private List<BaseMapCreateDto> convertMapToBaseMap(@Nullable List<Map<String, Object>> basemapsToConvert) {
        List<BaseMapCreateDto> baseMaps = new ArrayList<>();
        if (basemapsToConvert == null || basemapsToConvert.isEmpty()) {
            return baseMaps;
        }

        basemapsToConvert.forEach(baseMap -> {
            BaseMapCreateDto dto = new BaseMapCreateDto();
            if (baseMap.containsKey("id")) {
                dto.setBaseMapId((long) Double.parseDouble(baseMap.get("id").toString()));
            }

            if (baseMap.containsKey("position")) {
                dto.setPosition((int) Double.parseDouble(baseMap.get("position").toString()));
            }

            if (baseMap.containsKey("title")) {
                dto.setTitle(String.valueOf(baseMap.get("title")));
            }

            baseMaps.add(dto);
        });

        return baseMaps;
    }
}
