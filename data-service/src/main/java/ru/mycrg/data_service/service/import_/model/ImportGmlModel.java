package ru.mycrg.data_service.service.import_.model;

import java.time.LocalDateTime;

public class ImportGmlModel {

    private String title;
    private String documentType;
    private String details;
    private LocalDateTime docDateApprove;
    private Integer scale;
    private String oktmo;
    private boolean invertCoordinates;
    private String fileName;

    public ImportGmlModel(String title, String documentType, String details, LocalDateTime docDateApprove,
                          Integer scale, String oktmo, String fileName, boolean invertCoordinates) {
        this.title = title;
        this.documentType = documentType;
        this.details = details;
        this.docDateApprove = docDateApprove;
        this.scale = scale;
        this.oktmo = oktmo;
        this.fileName = fileName;
        this.invertCoordinates = invertCoordinates;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getDocDateApprove() {
        return docDateApprove;
    }

    public void setDocDateApprove(LocalDateTime docDateApprove) {
        this.docDateApprove = docDateApprove;
    }

    public Integer getScale() {
        return scale;
    }

    public void setScale(Integer scale) {
        this.scale = scale;
    }

    public String getOktmo() {
        return oktmo;
    }

    public void setOktmo(String oktmo) {
        this.oktmo = oktmo;
    }

    public boolean isInvertCoordinates() {
        return invertCoordinates;
    }

    public void setInvertCoordinates(boolean invertCoordinates) {
        this.invertCoordinates = invertCoordinates;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
