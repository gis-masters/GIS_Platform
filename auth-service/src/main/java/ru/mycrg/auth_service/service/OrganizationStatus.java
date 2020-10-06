package ru.mycrg.auth_service.service;

public enum OrganizationStatus {

    PROVISIONING("PROVISIONING"),
    PROVISIONED("PROVISIONED"),
    PROVISIONING_FAILED("PROVISIONING_FAILED"),
    DELETING("DELETING");

    private String status;

    OrganizationStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
