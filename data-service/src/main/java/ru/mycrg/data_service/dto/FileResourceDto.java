package ru.mycrg.data_service.dto;

public class FileResourceDto {

    String libraryName;
    String innerPath;

    public FileResourceDto(String libraryName, String innerPath) {
        this.libraryName = libraryName;
        this.innerPath = innerPath;
    }

    public String getLibraryName() {
        return libraryName;
    }

    public void setLibraryName(String libraryName) {
        this.libraryName = libraryName;
    }

    public String getInnerPath() {
        return innerPath;
    }

    public void setInnerPath(String innerPath) {
        this.innerPath = innerPath;
    }
}
