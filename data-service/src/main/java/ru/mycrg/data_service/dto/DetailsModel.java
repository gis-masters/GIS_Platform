package ru.mycrg.data_service.dto;

import java.util.ArrayList;
import java.util.List;

public class DetailsModel {

    private final List<ProcessModel> tasks = new ArrayList<>();

    public DetailsModel() {
        // Required
    }

    public List<ProcessModel> getTasks() {
        return tasks;
    }

    public void addTask(ProcessModel subProcess) {
        this.tasks.add(subProcess);
    }
}
