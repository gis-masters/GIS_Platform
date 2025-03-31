package ru.mycrg.acceptance.data_service.dto;

import java.util.List;

public class SmevLibsDocModel extends DefaultDocumentModel {

    private List<FileDescriptionModel> file;

    public SmevLibsDocModel(String title, String name, String category, List<FileDescriptionModel> someFiles,
                            List<FileDescriptionModel> file) {
        super(title, name, category, someFiles);
        this.file = file;
    }

    public List<FileDescriptionModel> getFile() {
        return file;
    }

    public void setFile(List<FileDescriptionModel> file) {
        this.file = file;
    }
}
