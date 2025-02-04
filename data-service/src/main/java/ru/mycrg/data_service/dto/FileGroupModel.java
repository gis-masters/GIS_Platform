package ru.mycrg.data_service.dto;

import java.util.Set;

public class FileGroupModel {

    private Set<String> required;
    private Set<String> full;

    public FileGroupModel(Set<String> required) {
        this.required = required;
        this.full = required;
    }

    public FileGroupModel(Set<String> required, Set<String> full) {
        this.required = required;
        this.full = full;
    }

    public Set<String> getRequired() {
        return required;
    }

    public void setRequired(Set<String> required) {
        this.required = required;
    }

    public Set<String> getFull() {
        return full;
    }

    public void setFull(Set<String> full) {
        this.full = full;
    }
}
