package ru.mycrg.geoserver_client.services.wms;

import okhttp3.HttpUrl;
import okhttp3.Request;
import okhttp3.Response;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Collections.singletonList;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

public class WmsService extends GeoServerBaseService {

    private final String WMS = "WMS";

    private String version = "1.3.0";
    private String format = "image/vnd.jpeg-png8";
    private String crs = "EPSG:3857";

    public WmsService(String accessToken) {
        super(accessToken);
    }

    public WmsService(String accessToken, WmsProperties props) {
        super(accessToken);

        if (nonNull(props.getVersion())) {
            this.version = props.getVersion();
        }

        if (nonNull(props.getFormat())) {
            this.format = props.getFormat();
        }

        if (nonNull(props.getCrs())) {
            this.crs = props.getCrs();
        }
    }

    public Response getMap(WmsProperties props) throws HttpClientException, IOException {
        initDefaultProperty(props);

        String bbox = buildBboxString(props.getBbox());
        String layers = buildParamFromList(props.getComplexLayerNames());
        String styles = buildParamFromList(props.getStyles());

        HttpUrl url = getGeoserverWmsUrl()
                .newBuilder()
                .addQueryParameter("SERVICE", WMS)
                .addQueryParameter("VERSION", version)
                .addQueryParameter("REQUEST", "GetMap")
                .addQueryParameter("FORMAT", format)
                .addQueryParameter("CRS", crs)
                .addQueryParameter("TRANSPARENT", String.valueOf(props.getTransparent()))
                .addQueryParameter("LAYERS", layers)
                .addQueryParameter("STYLES", styles)
                .addQueryParameter("WIDTH", String.valueOf(props.getWidth()))
                .addQueryParameter("HEIGHT", String.valueOf(props.getHeight()))
                .addQueryParameter("BBOX", bbox)
                .build();

        Request httpRequest = builderWithBearerAuth.url(url)
                                                   .get()
                                                   .build();

        return httpClient.getRequestHandler().handle(httpRequest);
    }

    private String buildParamFromList(List<String> strings) {
        if (strings.isEmpty()) {
            return "";
        }

        return String.join(",", strings);
    }

    private String buildBboxString(Double[] bbox) {
        if (bbox.length != 4) {
            throw new IllegalArgumentException("Bbox должен содержать координаты 2х точек");
        }

        return Arrays.stream(bbox)
                     .map(String::valueOf)
                     .collect(Collectors.joining(","));
    }

    private void initDefaultProperty(WmsProperties props) {
        if (isNull(props.getTransparent())) {
            props.setTransparent(false);
        }

        if (isNull(props.getStyles())) {
            props.setStyles(singletonList(""));
        }

        if (isNull(props.getWidth())) {
            props.setWidth(300);
        }

        if (isNull(props.getHeight())) {
            props.setHeight(300);
        }
    }
}
