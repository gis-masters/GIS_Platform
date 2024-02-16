package ru.mycrg.data_service_contract.dto;

import java.util.Objects;

public class ValueTitleProjection {

    private String value;
    private String title;

    public ValueTitleProjection() {
        // Required
    }

    public ValueTitleProjection(String title) {
        this.title = title;
        this.value = title;
    }

    public ValueTitleProjection(String value, String title) {
        this.value = value;
        this.title = title;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ValueTitleProjection that = (ValueTitleProjection) o;
        return Objects.equals(value, that.value) && Objects.equals(title, that.title);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value, title);
    }
}
