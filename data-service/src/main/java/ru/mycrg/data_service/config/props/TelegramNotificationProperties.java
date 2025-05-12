package ru.mycrg.data_service.config.props;

public class TelegramNotificationProperties {

    private String name;
    private String chatId;
    private String token;
    private String messageThreadId;

    public TelegramNotificationProperties() {
        // Required
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessageThreadId() {
        return messageThreadId;
    }

    public void setMessageThreadId(String messageThreadId) {
        this.messageThreadId = messageThreadId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"chatId\":" + (chatId == null ? "null" : "\"" + chatId + "\"") + ", " +
                "\"token\":" + (token == null ? "null" : "\"" + token + "\"") + ", " +
                "\"messageThreadId\":" + (messageThreadId == null ? "null" : "\"" + messageThreadId + "\"") +
                "}";
    }
}
