package ru.mycrg.data_service.entity;

import lombok.Data;

@Data
public class TableObjectImpl implements ITableObject {

    private Long id;

    public TableObjectImpl(Long id) {
        this.id = id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return this.id;
    }
}
