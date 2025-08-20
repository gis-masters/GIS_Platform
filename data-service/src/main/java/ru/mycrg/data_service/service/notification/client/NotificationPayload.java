package ru.mycrg.data_service.service.notification.client;

import java.util.ArrayList;
import java.util.List;

public class NotificationPayload {

    /**
     * Название профиля из существующих на notification сервисе.
     */
    private String profileName;

    /**
     * Идентификатор клиента/чата.
     */
    private String chatId;
    private List<NotificationProperty> props;

    public NotificationPayload(String profileName, String chatId) {
        this.profileName = profileName;
        this.chatId = chatId;
        this.props = new ArrayList<>();
    }

    // Геттеры и сеттеры
    public String getProfileName() {
        return profileName;
    }

    public void setProfileName(String profileName) {
        this.profileName = profileName;
    }

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public List<NotificationProperty> getProps() {
        return props;
    }

    public void setProps(List<NotificationProperty> props) {
        this.props = props;
    }
}
