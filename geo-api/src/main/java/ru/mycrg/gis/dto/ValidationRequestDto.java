package ru.mycrg.gis.dto;

import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

public class ValidationRequestDto extends BaseRequest {

    @NotEmpty // Мы не владеем информацией о том какие слоя есть в проекте. Чтобы принять пустой массив за сигнал к
    // тому чтобы провалидировать весь проект.
    private List<String> layers = new ArrayList<>();

    public ValidationRequestDto() {}

    public List<String> getLayers() {
        return layers;
    }

    public void setLayers(List<String> layers) {
        this.layers = layers;
    }
}
