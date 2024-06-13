package ru.mycrg.common_contracts.generated.specialization;

import java.util.ArrayList;
import java.util.List;

public class SpecializationView {

    private int id;
    private String title;
    private String description;
    private List<String> tags = new ArrayList<>();

    public SpecializationView() {
        // Required
    }

    public SpecializationView(int id, String title, String description, List<String> tags) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.tags = tags;
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

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}
