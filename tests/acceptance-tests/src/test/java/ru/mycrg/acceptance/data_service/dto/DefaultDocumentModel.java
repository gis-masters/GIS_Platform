package ru.mycrg.acceptance.data_service.dto;

import java.util.ArrayList;
import java.util.List;

public class DefaultDocumentModel {

    private final String title;
    private String name;
    private String category;
    private List<FileDescriptionModel> some_files;

    public DefaultDocumentModel(String title) {
        this(title, null, null, new ArrayList<>());
    }

    public DefaultDocumentModel(String title, String name, String category, List<FileDescriptionModel> someFiles) {
        this.title = title;
        this.name = name;
        this.category = category;
        this.some_files = someFiles;
    }

    public String getTitle() {
        return title;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<FileDescriptionModel> getSome_files() {
        return some_files;
    }

    public void setSome_files(List<FileDescriptionModel> some_files) {
        this.some_files = some_files;
    }

    public void addFile(FileDescriptionModel file) {
        this.some_files.add(file);
    }
}
