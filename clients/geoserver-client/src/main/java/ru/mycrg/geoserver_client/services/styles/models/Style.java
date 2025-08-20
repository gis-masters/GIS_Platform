package ru.mycrg.geoserver_client.services.styles.models;

public class Style {

    private String name;
    private String format;
    private LanguageVersion languageVersion;
    private String filename;

    public Style(String name, String format, LanguageVersion languageVersion, String filename) {
        this.name = name;
        this.format = format;
        this.languageVersion = languageVersion;
        this.filename = filename;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public LanguageVersion getLanguageVersion() {
        return languageVersion;
    }

    public void setLanguageVersion(LanguageVersion languageVersion) {
        this.languageVersion = languageVersion;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }
}
