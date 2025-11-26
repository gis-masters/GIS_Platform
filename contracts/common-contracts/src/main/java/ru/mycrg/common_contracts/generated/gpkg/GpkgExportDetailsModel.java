package ru.mycrg.common_contracts.generated.gpkg;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class GpkgExportDetailsModel implements Serializable {

    private String pathToGpkgFile;
    private List<String> messages = new ArrayList<>();

    public GpkgExportDetailsModel() {
        //required
    }

    public GpkgExportDetailsModel(String path) {
        this.pathToGpkgFile = path;
    }

    public GpkgExportDetailsModel(List<String> messages) {
        this.messages = messages;
    }

    public String getPathToGpkgFile() {
        return pathToGpkgFile;
    }

    public void setPathToGpkgFile(String pathToGpkgFile) {
        this.pathToGpkgFile = pathToGpkgFile;
    }

    public List<String> getMessages() {
        return messages;
    }

    public void setMessages(List<String> messages) {
        this.messages = messages;
    }
}
