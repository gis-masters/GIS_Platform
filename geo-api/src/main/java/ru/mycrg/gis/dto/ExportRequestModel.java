package ru.mycrg.gis.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

public class ExportRequestModel {

    @NotBlank(message = "Забыли указать формат експорта")
    private String format;

    @NotEmpty
    private List<String> layers = new ArrayList<>();

    public ExportRequestModel() {}

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public List<String> getLayers() {
        return layers;
    }

    public void setLayers(List<String> layers) {
        this.layers = layers;
    }
}
