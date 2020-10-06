package ru.mycrg.auth_service_contract;

public interface IOrganizationEvent extends IAuthServiceEvent {
    Long getOrgId();
    String getToken();
}
