package ru.mycrg.auth_service_contract.events.request;

public class UserDeletedEvent extends UserBaseRequestEvent {

    private Long userId;

    public UserDeletedEvent() {
        super();
    }

    public UserDeletedEvent(String login, String token, Long id) {
        super(login, token);

        this.userId = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
