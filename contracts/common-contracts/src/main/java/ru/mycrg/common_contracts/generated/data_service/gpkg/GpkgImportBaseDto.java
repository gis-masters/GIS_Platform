package ru.mycrg.common_contracts.generated.data_service.gpkg;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public abstract class GpkgImportBaseDto implements Serializable {

    private String title;
    private GpkgProcessStatus status;
    private List<String> messages = new ArrayList<>();

    public GpkgImportBaseDto() {

    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public GpkgProcessStatus getStatus() {
        return status;
    }

    public void setStatus(GpkgProcessStatus status) {
        this.status = status;
    }

    public List<String> getMessages() {
        return messages != null ? messages : new ArrayList<>();
    }

    public void setMessages(List<String> messages) {
        this.messages = messages != null ? messages : new ArrayList<>();
    }

    @Override
    public String toString() {
        return "{" +
                "\"name\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"status\":" + (status == null ? "null" : "\"" + status + "\"") + ", " +
                "\"messages\":" + (messages == null ? "null" : "\"" + messages + "\"") + ", " +
                "}";
    }
}
