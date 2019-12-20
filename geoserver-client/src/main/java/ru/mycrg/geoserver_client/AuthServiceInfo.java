package ru.mycrg.geoserver_client;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthServiceInfo {

    private String host;
    private int port;
    private String clientId;
    private String clientSecret;

}
