package ru.mycrg.geoserver_client.contracts.datastores.base;

public enum Drivers {
    DXF("DXF"),
    MAP_INFO("MapInfo File");

    private final String name;

    Drivers(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
