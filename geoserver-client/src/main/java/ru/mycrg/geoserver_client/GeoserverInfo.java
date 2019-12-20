package ru.mycrg.geoserver_client;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GeoserverInfo {

    private String host;
    private int port;
    private String rootUserName;
    private String password;
    private String userServiceName;

}
