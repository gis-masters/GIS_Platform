package ru.mycrg.data_service.dto;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

public class AisUmsModel {

    @Valid
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
