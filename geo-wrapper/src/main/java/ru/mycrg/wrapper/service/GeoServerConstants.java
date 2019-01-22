package ru.mycrg.wrapper.service;

import okhttp3.MediaType;

public class GeoServerConstants {

    public static final MediaType JSON_MEDIA_TYPE = MediaType.parse("application/json; charset=utf-8");
    public static final MediaType XML_ATOM_MEDIA_TYPE = MediaType.parse("application/atom+xml");
    public static final MediaType XML_MEDIA_TYPE = MediaType.parse("application/xml");

    public static final String DEFAULT_DB_NAME = "database";
    public static final String DEFAULT_USER_NAME = "Admin";
    public static final String DEFAULT_WORKSPACE_NAME = "workspace";
    public static final String DEFAULT_DATASTORE_NAME = DEFAULT_WORKSPACE_NAME + "_store";
    public static final String DEFAULT_ROLE_NAME = "admin_" + DEFAULT_WORKSPACE_NAME;

}
