package ru.mycrg.data_service.service.notifiers.telegram;

import com.fasterxml.jackson.core.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.config.props.TelegramNotificationProperties;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.geo_json.Feature;

import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.ValueType.FILE;
import static ru.mycrg.http_client.JsonConverter.fromJson;

@Component
public class TelegramNotifierFile implements ITelegramNotifier {

    private final Logger log = LoggerFactory.getLogger(TelegramNotifierFile.class);

    private final FileRepository fileRepository;
    private final TelegramMessageSender telegramMessageSender;

    public TelegramNotifierFile(FileRepository fileRepository, TelegramMessageSender telegramMessageSender) {
        this.fileRepository = fileRepository;
        this.telegramMessageSender = telegramMessageSender;
    }

    @Override
    public void notify(TelegramNotificationProperties notificationProfile, Object payload, String attribute) {
        Feature feature = (Feature) payload;

        Optional<List<FileDescription>> oDescription =
                fromJson(feature.getProperties().get(attribute).toString(),
                         new TypeReference<>() {
                         });

        if (oDescription.isPresent()) {
            oDescription.get().forEach(fileDescription -> {
                log.debug("Отправка файла в телеграмм. {}", fileDescription);

                File fileEntity = fileRepository
                        .findById(fileDescription.getId())
                        .orElseThrow(() -> new NotFoundException(fileDescription.getId()));

                telegramMessageSender.sendDocument(notificationProfile.getToken(),
                                                   new java.io.File(fileEntity.getPath()),
                                                   notificationProfile.getChatId(),
                                                   notificationProfile.getMessageThreadId());
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
