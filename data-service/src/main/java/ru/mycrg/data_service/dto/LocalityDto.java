package ru.mycrg.data_service.dto;

public class LocalityDto {

    private Long objectId;
    private String locality;
    private String oktmo;

    public LocalityDto() {
        // Required
    }

    public Long getObjectId() {
        return objectId;
    }

    public void setObjectId(Long objectId) {
        this.objectId = objectId;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public String getOktmo() {
        return oktmo;
    }

    public void setOktmo(String oktmo) {
        this.oktmo = oktmo;
    }

    @Override
    public String toString() {
        return "LocalityDto{" +
                "objectId=" + objectId +
                ", locality='" + locality + '\'' +
                ", oktmo='" + oktmo + '\'' +
                '}';
    }
}
