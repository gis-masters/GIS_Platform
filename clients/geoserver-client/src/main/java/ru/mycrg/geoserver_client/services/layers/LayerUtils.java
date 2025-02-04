package ru.mycrg.geoserver_client.services.layers;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LayerUtils {

    private LayerUtils() {
        throw new IllegalStateException("Utility class");
    }

    public static String getWorkspaceName(String href) {
        String string = null;

        Matcher matcherParam = Pattern.compile("(?<=\\bworkspaces/)(\\w+)")
                                      .matcher(href);

        if (matcherParam.find()) {
            string = matcherParam.group();
        }

        return string;
    }

    public static String getCoverageStoreName(String href) {
        String string = null;

        Matcher matcherParam = Pattern.compile("(?<=\\bcoveragestores/)(\\w+)")
                                      .matcher(href);

        if (matcherParam.find()) {
            string = matcherParam.group();
        }

        return string;
    }
}
