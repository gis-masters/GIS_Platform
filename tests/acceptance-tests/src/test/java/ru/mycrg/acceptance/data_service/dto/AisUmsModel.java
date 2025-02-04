package ru.mycrg.acceptance.data_service.dto;

import java.util.ArrayList;
import java.util.List;

public class AisUmsModel {

    private List<AisUmsDto> content = new ArrayList<>();

    public AisUmsModel() {
        // Required
    }

    public AisUmsModel(List<AisUmsDto> content) {
        this.content = content;
    }

    public List<AisUmsDto> getContent() {
        return content;
    }

    public void setContent(List<AisUmsDto> content) {
        this.content = content;
    }
}
