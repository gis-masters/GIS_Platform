package ru.mycrg.data_service.dto;

import java.util.ArrayList;
import java.util.List;

public class DetailsModel {

    private List<TaskModel> tasks = new ArrayList<>();

    public DetailsModel() {}

    public List<TaskModel> getTasks() {
        return tasks;
    }

    public void addTask(TaskModel subProcess) {
        this.tasks.add(subProcess);
    }
}
