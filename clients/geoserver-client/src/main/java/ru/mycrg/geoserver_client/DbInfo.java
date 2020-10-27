package ru.mycrg.geoserver_client;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DbInfo {

    private String dbHost;
    private int dbPort;
    private String dbOwnerUser;
    private String dbOwnerPassword;

}
