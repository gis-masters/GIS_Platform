package ru.mycrg.notification.domain.notification.models.payload;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ru.mycrg.notification.domain.notification.models.Property;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class EmailPayload extends NotificationPayload {
    
    private String email;
    private String subject;
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("EmailPayload{");
        
        // Добавляем специфичные поля
        sb.append("email='").append(email).append("', ");
        sb.append("subject='").append(subject).append("'");
        
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