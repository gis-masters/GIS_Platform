package ru.mycrg.wrapper.service.rule;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.service.GeoServerBaseService;

import java.io.IOException;

import static ru.mycrg.wrapper.service.GeoServerConstants.XML_MEDIA_TYPE;

@Service
public class RulesService extends GeoServerBaseService {

    public void addRule(String rule, String role) throws IOException {
        RequestBody body = RequestBody.create(XML_MEDIA_TYPE,
                "<rules>\n" +
                        "   <rule resource=\"" + rule + "\">" + role + "</rule>\n" +
                        "</rules>");

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/acl/layers")
                .post(body)
                .build();

        doRequest(request, "addRule");
    }

}
