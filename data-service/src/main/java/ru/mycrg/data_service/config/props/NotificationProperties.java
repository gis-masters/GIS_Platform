package ru.mycrg.data_service.config.props;

import com.google.common.base.Objects;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "crg-options.notification")
public class NotificationProperties {

    private List<TelegramNotificationProperties> telegram;

    public NotificationProperties() {
        this.telegram = new ArrayList<>();
    }

    public List<TelegramNotificationProperties> getTelegram() {
        return telegram;
    }

    public void setTelegram(List<TelegramNotificationProperties> telegram) {
        this.telegram = telegram;
    }

    @Override
    public String toString() {
        return Objects.toStringHelper(this)
                      .add("telegram", telegram)
                      .toString();
    }
}
