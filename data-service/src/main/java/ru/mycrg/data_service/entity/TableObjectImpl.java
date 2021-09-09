package ru.mycrg.data_service.entity;

public class TableObjectImpl implements ITableObject {

    private Long id;

    public TableObjectImpl() {
        // Required
    }

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
