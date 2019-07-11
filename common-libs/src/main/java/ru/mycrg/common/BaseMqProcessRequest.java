package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessType;

public class BaseMqProcessRequest {

    private Long id;
    private ProcessType type;

    public BaseMqProcessRequest() {
    }

    public BaseMqProcessRequest(Long id) {
        this.id = id;
    }

    public BaseMqProcessRequest(Long id, ProcessType type) {
        this.id = id;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public ProcessType getType() {
        return type;
    }

}
