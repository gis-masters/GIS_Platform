package ru.mycrg.data_service.dto;

import java.util.Objects;

public class FtsDictionaryItem {

    private String word;
    private Integer typeId;
    private Float dist;

    public FtsDictionaryItem() {
        // Required
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public Integer getTypeId() {
        return typeId;
    }

    public void setTypeId(Integer typeId) {
        this.typeId = typeId;
    }

    public Float getDist() {
        return dist;
    }

    public void setDist(float dist) {
        this.dist = dist;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FtsDictionaryItem that = (FtsDictionaryItem) o;
        return Objects.equals(word, that.word) && Objects.equals(typeId, that.typeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(word, typeId);
    }

    @Override
    public String toString() {
        return "{" +
                "\"word\":" + (word == null ? "null" : "\"" + word + "\"") + ", " +
                "\"typeId\":" + (typeId == null ? "null" : "\"" + typeId + "\"") + ", " +
                "\"dist\":\"" + dist + "\"" +
                "}";
    }
}
