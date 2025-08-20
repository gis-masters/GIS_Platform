package ru.mycrg.data_service.dto;

import java.util.Objects;

public class FtsHeadline {

    private String data;
    private float dist;

    public FtsHeadline() {
        // Required
    }

    public FtsHeadline(String data, float dist) {
        this.data = data;
        this.dist = dist;
    }

    public float getDist() {
        return dist;
    }

    public void setDist(float dist) {
        this.dist = dist;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FtsHeadline ftsHeadline = (FtsHeadline) o;
        return Float.compare(dist, ftsHeadline.dist) == 0 && Objects.equals(data, ftsHeadline.data);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dist, data);
    }

    @Override
    public String toString() {
        return "{" +
                "\"data\":" + (data == null ? "null" : "\"" + data + "\"") + ", " +
                "\"dist\":\"" + dist + "\"" +
                "}";
    }
}
