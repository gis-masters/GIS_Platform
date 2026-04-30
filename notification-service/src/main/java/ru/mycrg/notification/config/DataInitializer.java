package ru.mycrg.notification.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.mycrg.notification.domain.strategy.StrategyEntity;
import ru.mycrg.notification.domain.strategy.StrategyRepository;

/**
 * Инициализатор данных при запуске приложения
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final StrategyRepository strategyRepository;

    public DataInitializer(StrategyRepository strategyRepository) {
        this.strategyRepository = strategyRepository;
    }

    @Override
    public void run(String... args) {
        // Проверяем, есть ли уже стратегии в базе
        if (strategyRepository.count() == 0) {
            log.info("Инициализация базовых стратегий отправки...");

            // Создаем стратегию по умолчанию
            StrategyEntity defaultStrategyEntity = StrategyEntity
                    .builder()
                    .name("default")
                    .description("Стратегия по умолчанию: 3 попытки с интервалом 60 секунд")
                    .maxRetries(3)
                    .retryIntervalSeconds(60L)
                    .active(true)
                    .build();
            strategyRepository.save(defaultStrategyEntity);

            // Создаем стратегию для срочных уведомлений
            StrategyEntity urgentStrategyEntity = StrategyEntity
                    .builder()
                    .name("urgent")
                    .description("Стратегия для срочных уведомлений: 5 попыток с интервалом 30 секунд")
                    .maxRetries(5)
                    .retryIntervalSeconds(30L)
                    .active(true)
                    .build();
            strategyRepository.save(urgentStrategyEntity);

            // Создаем стратегию для несрочных уведомлений
            StrategyEntity nonUrgentStrategyEntity = StrategyEntity
                    .builder()
                    .name("non-urgent")
                    .description("Стратегия для несрочных уведомлений: 2 попытки с интервалом 300 секунд")
                    .maxRetries(2)
                    .retryIntervalSeconds(300L)
                    .active(true)
                    .build();
            strategyRepository.save(nonUrgentStrategyEntity);

            log.info("Базовые стратегии отправки созданы успешно");
        } else {
            log.info("Стратегии отправки уже существуют, инициализация не требуется");
        }
    }
}
