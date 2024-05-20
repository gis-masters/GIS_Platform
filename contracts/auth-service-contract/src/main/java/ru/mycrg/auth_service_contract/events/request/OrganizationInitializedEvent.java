package ru.mycrg.auth_service_contract.events.request;

import ru.mycrg.common_contracts.generated.Specialization;

public class OrganizationInitializedEvent extends OrganizationBaseRequestEvent {

    private String ownerRawPassword;
    private String ownerEmail;
    private String ownerUserName;
    private String geoserverLogin;
    private Specialization specialization;

    public OrganizationInitializedEvent() {
        super();
    }

    public OrganizationInitializedEvent(Long orgId, String token, String ownerRawPassword, String ownerEmail,
                                        String ownerUserName, String geoserverLogin, Specialization specialization) {
        super(orgId, token);

        this.ownerRawPassword = ownerRawPassword;
        this.ownerEmail = ownerEmail;
        this.ownerUserName = ownerUserName;
        this.geoserverLogin = geoserverLogin;
        this.specialization = specialization;
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

    public Specialization getSpecialization() {
        return specialization;
    }
}
