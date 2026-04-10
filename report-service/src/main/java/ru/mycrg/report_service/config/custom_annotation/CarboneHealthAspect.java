package ru.mycrg.report_service.config.custom_annotation;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.boot.health.contributor.Health;
import org.springframework.boot.health.contributor.Status;
import org.springframework.stereotype.Component;
import ru.mycrg.report_service.exceptions.CarboneUnavailableException;
import ru.mycrg.report_service.services.CarboneHealthIndicator;

@Aspect
@Component
public class CarboneHealthAspect {

    private final CarboneHealthIndicator healthIndicator;

    public CarboneHealthAspect(CarboneHealthIndicator healthIndicator) {
        this.healthIndicator = healthIndicator;
    }

    @Before("@annotation(RequiresCarboneHealth)")
    public void checkCarboneHealth() {
        Health health = healthIndicator.health();

        if (health.getStatus() != Status.UP) {
            throw new CarboneUnavailableException("Сервис печати не может выполнить ваш запрос." +
                                                          " Причина: Carbone недоступен или перегружен."
                                                          + " Попробуйте выполнить ваш запрос позже или" +
                                                          " перезагрузить Carbone.");
        }
    }
}
