package ru.mycrg.data_service.entity;

import lombok.Data;

import java.util.UUID;

@Data
public class ITableObjectImpl implements ITableObject {

    private UUID id;

    public ITableObjectImpl(UUID id) {
        this.id = id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getId() {
        return this.id;
    }
}
