package ru.mycrg.common_contracts.generated.specialization;

import ru.mycrg.common_contracts.specialization.Settings;

public class SpecializationView {

    private int id;
    private String title;
    private String description;
    private Settings settings;

    public SpecializationView() {
        // Required
    }

    public SpecializationView(int id, String title, String description, Settings settings) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.settings = settings;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Settings getSettings() {
        return settings;
    }

    public void setSettings(Settings settings) {
        this.settings = settings;
    }
}
