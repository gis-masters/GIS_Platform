package ru.mycrg.geoserver_client.services.storage.raster;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RasterStorageUtils {

    private RasterStorageUtils() {
        throw new IllegalStateException("Utility class");
    }

    public static String getFilePath(String fullUrl) {
        Matcher matcherPath = Pattern.compile("(?<=file://).*$").matcher(fullUrl);
        String url = null;
        if (matcherPath.find()) {
            url = matcherPath.group();
        }

        return url;
    }
}
