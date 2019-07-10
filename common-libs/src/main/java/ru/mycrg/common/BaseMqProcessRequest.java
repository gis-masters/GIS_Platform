package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessType;

public class BaseMqProcessRequest {

    private long id;
    private ProcessType type;

    public BaseMqProcessRequest() {
    }

    public BaseMqProcessRequest(long id) {
        this.id = id;
    }

    public BaseMqProcessRequest(long id, ProcessType type) {
        this.id = id;
        this.type = type;
    }

    public long getId() {
        return id;
    }

    public ProcessType getType() {
        return type;
    }

}
