package ru.mycrg.data_service.service.smev3.model;

public class RecordData {
    private String libId;

    private Object recordId;

    public RecordData(String libId, Object recordId) {
        this.libId = libId;
        this.recordId = recordId;
    }

    public String getLibId() {
        return libId;
    }

    public RecordData setLibId(String libId) {
        this.libId = libId;
        return this;
    }

    public Object getRecordId() {
        return recordId;
    }

    public RecordData setRecordId(Object recordId) {
        this.recordId = recordId;
        return this;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (object == null || getClass() != object.getClass()) return false;

        RecordData that = (RecordData) object;

        if (!libId.equals(that.libId)) return false;
        return recordId.equals(that.recordId);
    }

    @Override
    public int hashCode() {
        int result = libId.hashCode();
        result = 31 * result + recordId.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return libId + "_" + recordId;
    }
}
