package ru.mycrg.data_service.entity;

import lombok.Data;

import java.util.UUID;

@Data
public class TableObjectImpl implements ITableObject {

    private UUID id;

    public TableObjectImpl(UUID id) {
        this.id = id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getId() {
        return this.id;
    }
}
