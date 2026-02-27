package ru.mycrg.report_service.services;

import io.carbone.CarboneException;
import io.carbone.ICarboneServices;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import ru.mycrg.report_service.dto.CarboneStatusDto;

import java.util.Optional;

import static ru.mycrg.http_client.JsonConverter.fromJson;

@Component
public class CarboneHealthIndicator implements HealthIndicator {

    private final ICarboneServices carboneServices;

    private final Logger log = LoggerFactory.getLogger(CarboneHealthIndicator.class);

    public CarboneHealthIndicator(ICarboneServices carboneServices) {
        this.carboneServices = carboneServices;
    }

    @Override
    public Health health() {
        try {
            String status = carboneServices.getStatus();

            Optional<CarboneStatusDto> oStatus = fromJson(status, CarboneStatusDto.class);

            if (oStatus.isPresent()) {
                if (oStatus.get().getCode() == 200) {
                    log.debug("Carbone вернул успешный статус подключения");

                    return Health.up().build();
                } else {
                    log.warn("Carbone вернул не код 200. Подробнее:  {} ", oStatus.get());

                    return Health.down().build();
                }
            } else {
                log.warn("Carbone не ответил на запрос '/status'.");

                return Health.down().build();
            }
        } catch (Exception e) {
            log.warn("Ошибка при обращении к Carbone '/status'. Ошибка => {}", e.getMessage());

            return Health.down().build();
        }
    }
}
