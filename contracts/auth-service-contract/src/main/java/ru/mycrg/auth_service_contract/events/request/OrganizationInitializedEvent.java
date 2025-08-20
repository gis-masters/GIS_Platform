package ru.mycrg.auth_service_contract.events.request;

public class OrganizationInitializedEvent extends OrganizationBaseRequestEvent {

    private String ownerRawPassword;
    private String ownerEmail;
    private String ownerUserName;
    private String geoserverLogin;
    private Integer specializationId;

    public OrganizationInitializedEvent() {
        super();
    }

    public OrganizationInitializedEvent(Long orgId, String rootToken, String ownerToken, String ownerRawPassword,
                                        String ownerEmail, String ownerUserName, String geoserverLogin,
                                        Integer specializationId) {
        super(orgId, rootToken, ownerToken);

        this.ownerRawPassword = ownerRawPassword;
        this.ownerEmail = ownerEmail;
        this.ownerUserName = ownerUserName;
        this.geoserverLogin = geoserverLogin;
        this.specializationId = specializationId;
    }

    public String getOwnerRawPassword() {
        return ownerRawPassword;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public String getOwnerUserName() {
        return ownerUserName;
    }

    public String getGeoserverLogin() {
        return geoserverLogin;
    }

    public Integer getSpecializationId() {
        return specializationId;
    }
}
