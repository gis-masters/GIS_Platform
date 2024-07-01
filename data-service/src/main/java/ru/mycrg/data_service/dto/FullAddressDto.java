package ru.mycrg.data_service.dto;

public class FullAddressDto {

    private Long objectId;
    private String fullAddress;
    private String oktmo;

    public FullAddressDto() {
        // Required
    }

    public Long getObjectId() {
        return objectId;
    }

    public void setObjectId(Long objectId) {
        this.objectId = objectId;
    }

    public String getFullAddress() {
        return fullAddress;
    }

    public void setFullAddress(String fullAddress) {
        this.fullAddress = fullAddress;
    }

    public String getOktmo() {
        return oktmo;
    }

    public void setOktmo(String oktmo) {
        this.oktmo = oktmo;
    }
}
