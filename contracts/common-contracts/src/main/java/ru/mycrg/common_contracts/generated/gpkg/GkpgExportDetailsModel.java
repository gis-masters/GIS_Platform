package ru.mycrg.common_contracts.generated.gpkg;

import java.io.Serializable;
import java.util.List;

public class GkpgExportDetailsModel implements Serializable {

    private String pathToGpkgFile;
    private List<MessageFromExport> messageFromExport;

    public GkpgExportDetailsModel() {
        //required
    }

    public GkpgExportDetailsModel(String pathToGpkgFile) {
        this.pathToGpkgFile = pathToGpkgFile;
    }

    public GkpgExportDetailsModel(List<MessageFromExport> messageFromExport) {
        this.messageFromExport = messageFromExport;
    }

    public String getPathToGpkgFile() {
        return pathToGpkgFile;
    }

    public void setPathToGpkgFile(String pathToGpkgFile) {
        this.pathToGpkgFile = pathToGpkgFile;
    }

    public List<MessageFromExport> getMessageFromExport() {
        return messageFromExport;
    }

    public void setMessageFromExport(List<MessageFromExport> messageFromExport) {
        this.messageFromExport = messageFromExport;
    }
}
