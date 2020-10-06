package ru.mycrg.auth_service_contract;

public class OrganizationInitializedEvent extends OrganizationBaseEvent {

    private String ownerRawPassword;
    private String ownerEmail;
    private String ownerUserName;

    public OrganizationInitializedEvent() {
    }

    public OrganizationInitializedEvent(Long orgId, String token,
                                        String ownerRawPassword, String ownerEmail, String ownerUserName) {
        super(orgId, token);

        this.ownerRawPassword = ownerRawPassword;
        this.ownerEmail = ownerEmail;
        this.ownerUserName = ownerUserName;
    }

    public String getOwnerRawPassword() {
        return ownerRawPassword;
    }

    public void setOwnerRawPassword(String ownerRawPassword) {
        this.ownerRawPassword = ownerRawPassword;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public String getOwnerUserName() {
        return ownerUserName;
    }

    public void setOwnerUserName(String ownerUserName) {
        this.ownerUserName = ownerUserName;
    }
}
