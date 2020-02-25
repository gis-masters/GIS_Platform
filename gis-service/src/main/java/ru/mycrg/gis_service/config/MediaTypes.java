package ru.mycrg.gis_service.config;

import org.springframework.http.MediaType;

public class MediaTypes {

    public static final String APPLICATION_JSON_MERGE_PATCH = "application/merge-patch+json";

    public static final MediaType APPLICATION_MERGE_PATCH_VALUE;

    static {
        APPLICATION_MERGE_PATCH_VALUE = MediaType.valueOf(APPLICATION_JSON_MERGE_PATCH);
    }

}
