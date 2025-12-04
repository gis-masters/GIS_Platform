package ru.mycrg.common_contracts.generated.data_service;

import java.util.UUID;

public class FileMetadata<T> {

    private UUID id;
    private T payload;

    public FileMetadata() {
        // Required
    }

    public FileMetadata(UUID id, T payload) {
        this.id = id;
        this.payload = payload;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }
}
