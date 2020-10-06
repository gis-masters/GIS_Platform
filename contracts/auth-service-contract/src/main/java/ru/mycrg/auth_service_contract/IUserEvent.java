package ru.mycrg.auth_service_contract;

public interface IUserEvent extends IAuthServiceEvent {
    String getLogin();
    String getToken();
}
