package ru.mycrg.data_service.service.smev3.model;

import java.util.UUID;


public class SmevAttachment {
    private final UUID attachmentId;
    private final UUID fileId;
    private final String fileName;
    private final String s3fileName;

    public SmevAttachment(UUID fileId,
                          String fileName,
                          UUID attachmentId,
                          String s3fileName) {
        this.fileId = fileId;
        this.fileName = fileName;
        this.attachmentId = attachmentId;
        this.s3fileName = s3fileName;
    }

    public UUID getAttachmentId() {
        return attachmentId;
    }

    public UUID getFileId() {
        return fileId;
    }

    public String getFileName() {
        return fileName;
    }

    public String getS3fileName() {
        return s3fileName;
    }
}
