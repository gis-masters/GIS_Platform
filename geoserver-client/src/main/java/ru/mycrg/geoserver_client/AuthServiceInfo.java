package ru.mycrg.geoserver_client;

import lombok.Builder;
import lombok.Data;

import java.net.URL;

@Data
@Builder
public class AuthServiceInfo {

    private URL url;
    private String clientId;
    private String clientSecret;

}
