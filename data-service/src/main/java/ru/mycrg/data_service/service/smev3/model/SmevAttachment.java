package ru.mycrg.data_service.service.smev3.model;

import java.util.UUID;


public class SmevAttachment {
    private String fileId;
    private String fileName;
    private UUID attachmentId;
    private String s3fileName;

    public SmevAttachment(String fileId, String fileName, UUID attachmentId, String s3fileName) {
        this.fileId = fileId;
        this.fileName = fileName;
        this.attachmentId = attachmentId;
        this.s3fileName = s3fileName;
    }

    public String getFileId() {
        return fileId;
    }

    public String getFileName() {
        return fileName;
    }

    public UUID getAttachmentId() {
        return attachmentId;
    }

    public String getS3fileName() {
        return s3fileName;
    }
}
