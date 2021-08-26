package ru.mycrg.geoserver_client.dto;

public class UserGeoserverDtoWrapper {

    private UserGeoserverDto user;

    public UserGeoserverDtoWrapper(UserGeoserverDto user) {
        this.user = user;
    }

    public UserGeoserverDto getUser() {
        return user;
    }

    public void setUser(UserGeoserverDto user) {
        this.user = user;
    }
}
