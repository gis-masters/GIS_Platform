package ru.mycrg.gis.service;

public class LayerInfo {

    private String name;
    private String binding;

    public LayerInfo() {}

    public LayerInfo(String name, String binding) {
        this.name = name;
        this.binding = binding;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBinding() {
        return binding;
    }

    public void setBinding(String binding) {
        this.binding = binding;
    }
}
