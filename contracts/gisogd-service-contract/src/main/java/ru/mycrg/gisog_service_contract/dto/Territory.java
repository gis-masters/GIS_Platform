package ru.mycrg.gisog_service_contract.dto;

import java.util.UUID;

public class Territory {

    private UUID guid;
    private String location;

    public Territory() {
        // Required
    }

    public Territory(UUID key, String location) {
        this.guid = key;
        this.location = location;
    }

    public UUID getGuid() {
        return guid;
    }

    public void setGuid(UUID guid) {
        this.guid = guid;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
