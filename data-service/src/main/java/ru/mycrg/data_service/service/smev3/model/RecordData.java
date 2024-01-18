package ru.mycrg.data_service.service.smev3.model;

import java.util.Objects;

public class RecordData {
    private final String libId;
    private final String jsonFieldName;
    private final Object id;

    public RecordData(String libId, String jsonFieldName, Object id) {
        this.libId = libId;
        this.jsonFieldName = jsonFieldName;
        this.id = id;
    }

    public static RecordData byId(String libId, Object id) {
        return new RecordData(libId, null, id);
    }

    public static RecordData byJsonId(String libId, String jsonFieldName, Object id) {
        return new RecordData(libId, jsonFieldName, id);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RecordData that = (RecordData) o;

        if (!libId.equals(that.libId)) return false;
        if (!Objects.equals(jsonFieldName, that.jsonFieldName))
            return false;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        int result = libId.hashCode();
        result = 31 * result + (jsonFieldName != null ? jsonFieldName.hashCode() : 0);
        result = 31 * result + id.hashCode();
        return result;
    }
}
