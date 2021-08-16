package ru.mycrg.data_service.dto.styles;

public class ActualStylesModel {

    protected String dataset;
    protected String identifier;

    public ActualStylesModel() {
        // Required
    }

    public String getDataset() {
        return dataset;
    }

    public void setDataset(String dataset) {
        this.dataset = dataset;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }
}
