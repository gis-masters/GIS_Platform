package ru.mycrg.common_contracts.generated.data_service.gpkg.import_;

import java.io.Serializable;
import java.util.UUID;

public class GpkgProcessReport extends GpkgReportBaseDto implements Serializable {

    private Long projectId;
    private UUID fileId;
    private String filePath;
    private String fileTitle;
    private GpkgPayloadData payload;

    public GpkgProcessReport() {
        // Required
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public UUID getFileId() {
        return fileId;
    }

    public void setFileId(UUID fileId) {
        this.fileId = fileId;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileTitle() {
        return fileTitle;
    }

    public void setFileTitle(String fileTitle) {
        this.fileTitle = fileTitle;
    }

    public GpkgPayloadData getPayload() {
        return payload;
    }

    public void setPayload(GpkgPayloadData payload) {
        this.payload = payload;
    }

    @Override
    public String toString() {
        return "{" +
                "\"projectId\":" + (projectId == null ? "null" : "\"" + projectId + "\"") + ", " +
                "\"fileId\":" + (fileId == null ? "null" : fileId) + ", " +
                "\"filePath\":" + (filePath == null ? "null" : "\"" + filePath + "\"") + ", " +
                "\"fileTitle\":" + (fileTitle == null ? "null" : "\"" + fileTitle + "\"") + ", " +
                "\"payload\":" + (payload == null ? "null" : payload) +
                "}";
    }
}
