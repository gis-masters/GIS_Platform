package ru.mycrg.auth_service_contract.events.request;

public class OrganizationInitializedEvent extends OrganizationBaseRequestEvent {

    private String ownerRawPassword;
    private String ownerEmail;
    private String ownerUserName;
    private String geoserverLogin;

    public OrganizationInitializedEvent() {
        super();
    }

    public OrganizationInitializedEvent(Long orgId, String token, String ownerRawPassword, String ownerEmail,
                                        String ownerUserName, String geoserverLogin) {
        super(orgId, token);

        this.ownerRawPassword = ownerRawPassword;
        this.ownerEmail = ownerEmail;
        this.ownerUserName = ownerUserName;
        this.geoserverLogin = geoserverLogin;
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
}
