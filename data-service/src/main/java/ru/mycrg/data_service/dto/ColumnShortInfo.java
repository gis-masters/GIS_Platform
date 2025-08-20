package ru.mycrg.data_service.dto;

public class ColumnShortInfo {

    private String columnName;
    private String udtName;
    private Integer characterMaximumLength;
    private Integer numericScale;

    public ColumnShortInfo() {
        // Required
    }

    public ColumnShortInfo(String columnName, String udtName, Integer characterMaximumLength, Integer numericScale) {
        this.columnName = columnName;
        this.udtName = udtName;
        this.characterMaximumLength = characterMaximumLength;
        this.numericScale = numericScale;
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    public String getUdtName() {
        return udtName;
    }

    public void setUdtName(String udtName) {
        this.udtName = udtName;
    }

    public Integer getCharacterMaximumLength() {
        return characterMaximumLength;
    }

    public void setCharacterMaximumLength(Integer characterMaximumLength) {
        this.characterMaximumLength = characterMaximumLength;
    }

    public Integer getNumericScale() {
        return numericScale;
    }

    public void setNumericScale(Integer numericScale) {
        this.numericScale = numericScale;
    }

    @Override
    public String toString() {
        return "{" +
                "\"columnName\":" + (columnName == null ? "null" : "\"" + columnName + "\"") + ", " +
                "\"udtName\":" + (udtName == null ? "null" : "\"" + udtName + "\"") + ", " +
                "\"characterMaximumLength\":" + (characterMaximumLength == null ? "null" : "\"" + characterMaximumLength + "\"") + ", " +
                "\"numericScale\":" + (numericScale == null ? "null" : "\"" + numericScale + "\"") +
                "}";
    }
}
