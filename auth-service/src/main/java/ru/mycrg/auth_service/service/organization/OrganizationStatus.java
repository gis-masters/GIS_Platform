package ru.mycrg.auth_service.service.organization;

public enum OrganizationStatus {

    PROVISIONING("PROVISIONING"),
    PROVISIONED("PROVISIONED"),
    PROVISIONING_FAILED("PROVISIONING_FAILED"),
    DELETING("DELETING");

    private final String status;

    OrganizationStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}
