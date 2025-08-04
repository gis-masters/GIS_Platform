package ru.mycrg.acceptance.data_service.dto;

import com.google.gson.annotations.SerializedName;

public class RecordDto {

    private String title;
    private String path;

    @SerializedName(value = "content_type_id")
    private String contentTypeId;

    public RecordDto(String title) {
        this(title, null, "folder_v1");
    }

    public RecordDto(String title, String path) {
        this(title, path, "folder_v1");
    }

    public RecordDto(String title, String path, String contentTypeId) {
        this.title = title;
        this.path = path;
        this.contentTypeId = contentTypeId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContentTypeId() {
        return contentTypeId;
    }

    public void setContentTypeId(String contentTypeId) {
        this.contentTypeId = contentTypeId;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
