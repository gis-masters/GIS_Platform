package ru.mycrg.notification.domain.notification.models.payload;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import ru.mycrg.notification.domain.notification.models.Property;

import java.util.ArrayList;
import java.util.List;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.DEDUCTION,
        defaultImpl = NotificationPayload.class
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = TelegramPayload.class),
        @JsonSubTypes.Type(value = EmailPayload.class)
})
@JsonIgnoreProperties(ignoreUnknown = true)
public class NotificationPayload {
    
    private List<Property> props = new ArrayList<>();
    
    public List<Property> getProps() {
        return props;
    }
    
    public void setProps(List<Property> props) {
        this.props = props != null ? props : new ArrayList<>();
    }
    
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName()).append("{");
        
        // Добавляем props
        if (props != null && !props.isEmpty()) {
            sb.append("props=[");
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