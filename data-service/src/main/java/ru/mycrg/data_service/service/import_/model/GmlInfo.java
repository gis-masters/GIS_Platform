package ru.mycrg.data_service.service.import_.model;

public class GmlInfo {

    private String title;
    private String documentType;
    private String details;
    private String docDateApprove;
    private Integer scale;
    private String oktmo;
    private boolean invertCoordinates;

    public GmlInfo(String title, String documentType, String details, String docDateApprove, Integer scale,
                   String oktmo, boolean invertCoordinates) {
        this.title = title;
        this.documentType = documentType;
        this.details = details;
        this.docDateApprove = docDateApprove;
        this.scale = scale;
        this.oktmo = oktmo;
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

    public String getDocDateApprove() {
        return docDateApprove;
    }

    public void setDocDateApprove(String docDateApprove) {
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
}
