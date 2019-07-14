package ru.mycrg.gis.dto;

import java.util.ArrayList;
import java.util.List;

public class DetailsModel {

    private List<SubProcessModel> subProcesses = new ArrayList<>();

    public DetailsModel() {}

    public List<SubProcessModel> getSubProcesses() {
        return subProcesses;
    }

    public void addSubProcess(SubProcessModel subProcess) {
        this.subProcesses.add(subProcess);
    }
}
