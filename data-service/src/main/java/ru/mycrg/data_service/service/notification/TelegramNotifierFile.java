package ru.mycrg.data_service.service.notification;

import com.fasterxml.jackson.core.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.notification.client.NotificationPayload;
import ru.mycrg.data_service.service.notification.client.NotificationProperty;
import ru.mycrg.data_service.service.notification.client.NotificationServiceClient;
import ru.mycrg.data_service.service.notification.client.TelegramNotificationModel;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.geo_json.Feature;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service_contract.enums.ValueType.FILE;
import static ru.mycrg.http_client.JsonConverter.fromJson;

@Component
public class TelegramNotifierFile implements ITelegramNotifier {

    private final Logger log = LoggerFactory.getLogger(TelegramNotifierFile.class);

    private final FileRepository fileRepository;
    private final NotificationServiceClient notificationServiceClient;

    public TelegramNotifierFile(FileRepository fileRepository, NotificationServiceClient notificationServiceClient) {
        this.fileRepository = fileRepository;
        this.notificationServiceClient = notificationServiceClient;
    }

    @Override
    public void notify(TelegramNotificationModel model, Object payload, String attribute) {
        Optional<List<FileDescription>> oDescription = Optional.empty();
        try {
            Feature feature = (Feature) payload;

            oDescription = fromJson(feature.getProperties().get(attribute).toString(),
                                    new TypeReference<>() {
                                    });
        } catch (Exception e) {
            logError("Не удалось обработать данные атрибута: " + attribute, e);
        }

        if (oDescription.isPresent()) {
            oDescription.get().forEach(fileDescription -> {
                log.debug("Отправка файла в телеграмм. {}", fileDescription);

                File fileEntity = fileRepository
                        .findById(fileDescription.getId())
                        .orElseThrow(() -> new NotFoundException(fileDescription.getId()));

                List<NotificationProperty> props = new ArrayList<>();
                props.add(new NotificationProperty(attribute, "FILE", fileEntity.getPath()));

                NotificationPayload notificationPayload = model.getPayload();
                notificationPayload.setProps(props);

                notificationServiceClient.notify(model);
            });
        } else {
            log.warn("Отправка данных в телеграмм. Не удалось прочесть описание файлов");
        }
    }

    @Override
    public ValueType getType() {
        return FILE;
    }
}
