package ru.mycrg.geoserver_client;

import okhttp3.MediaType;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;

public class GeoserverClient {

    public static final MediaType JSON_MEDIA_TYPE = MediaType.parse("application/json; charset=utf-8");
    public static final MediaType XML_ATOM_MEDIA_TYPE = MediaType.parse("application/atom+xml");
    public static final MediaType XML_MEDIA_TYPE = MediaType.parse("application/xml");

    private GeoserverClient() {
    }

    public static void initialize(GeoserverInfo geoserverInfo,
                                  DbInfo dbInfo) {
        GeoServerBaseService.geoserverInfo = geoserverInfo;
        GeoServerBaseService.dbInfo = dbInfo;
    }
}
