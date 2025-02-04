package ru.mycrg.data_service_contract.dto;

public class TypeDocumentData {

    private Long id;
    private String title;
    private String libraryTableName;

    public TypeDocumentData() {
        // Required
    }

    public TypeDocumentData(Long id, String title, String libraryTableName) {
        this.id = id;
        this.title = title;
        this.libraryTableName = libraryTableName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLibraryTableName() {
        return libraryTableName;
    }

    public void setLibraryTableName(String libraryTableName) {
        this.libraryTableName = libraryTableName;
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + (id == null ? "null" : "\"" + id + "\"") + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"libraryTableName\":" + (libraryTableName == null ? "null" : "\"" + libraryTableName + "\"") +
                "}";
    }
}
