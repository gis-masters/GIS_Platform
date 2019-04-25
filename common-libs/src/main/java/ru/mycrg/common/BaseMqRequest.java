package ru.mycrg.common;

import java.util.UUID;

public class BaseMqRequest {

    private UUID id;

    public BaseMqRequest() {}

    public BaseMqRequest(UUID id) {
        this.id = id;
    }

    public UUID getId() {
        return id;
    }

}
