package ru.mycrg.data_service.dto;

public class BaseWsModel {

    protected String wsUiId;

    public BaseWsModel() {
        // Required
    }

    public String getWsUiId() {
        return wsUiId;
    }

    public void setWsUiId(String wsUiId) {
        this.wsUiId = wsUiId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"wsUiId\":" + (wsUiId == null ? "null" : "\"" + wsUiId + "\"") +
                "}";
    }
}
