package ru.mycrg.notification.domain.notification.models.payload;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ru.mycrg.notification.domain.notification.models.Property;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TelegramPayload extends NotificationPayload {
    
    private String profileName;
    private String chatId;
    
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
    
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("TelegramPayload{");
        
        // Добавляем специфичные поля
        sb.append("profileName='").append(profileName).append("', ");
        sb.append("chatId='").append(chatId).append("'");
        
        // Добавляем props из родительского класса
        List<Property> props = getProps();
        if (props != null && !props.isEmpty()) {
            sb.append(", props=[");
            for (int i = 0; i < props.size(); i++) {
                Property prop = props.get(i);
                if (i > 0) {
                    sb.append(", ");
                }
                sb.append(prop.getName()).append("=").append(prop.getValue());
            }
            sb.append("]");
        }
        
        sb.append("}");
        return sb.toString();
    }
}