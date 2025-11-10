package ru.mycrg.data_service.service.import_.model;

import ru.mycrg.data_service_contract.enums.FileType;

import java.util.UUID;

public class DataFromGpkgPlacementModel {

    protected String filePath;
    private UUID fileId;
    private Long projectId;
    protected FileType fileType;

    public DataFromGpkgPlacementModel() {
        // Required
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public FileType getFileType() {
        return fileType;
    }

    public void setFileType(FileType fileType) {
        this.fileType = fileType;
    }

    public UUID getFileId() {
        return fileId;
    }

    public void setFileId(UUID fileId) {
        this.fileId = fileId;
    }
}
