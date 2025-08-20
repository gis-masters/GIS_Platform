package ru.mycrg.data_service.service.smev3.model;

public class ResponseAttachment {

    private final String name;
    private final String attachmentId;

    public ResponseAttachment(String name, String attachmentId) {
        this.name = name;
        this.attachmentId = attachmentId;
    }

    public String getName() {
        return name;
    }

    public String getAttachmentId() {
        return attachmentId;
    }
}

