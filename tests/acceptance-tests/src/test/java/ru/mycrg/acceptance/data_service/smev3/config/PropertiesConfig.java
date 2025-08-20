package ru.mycrg.acceptance.data_service.smev3.config;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

/**
 * На данный момент классы SmevTasksDefinitions и RabbitMQManager нуждаются в переменных среды
 * <p>
 * Для снижения копипасты и поддержания принципа единой ответственности создан отдельный класс
 * <p>
 */

public class PropertiesConfig {

    private static Properties properties;

    public static synchronized Properties getProperties() {
        if (properties == null) {
            properties = loadProperties();
        }

        return properties;
    }

    private static Properties loadProperties() {
        Properties props = new Properties();
        String pathToConfig = System.getProperty("config.file");

        try {
            if (pathToConfig != null) {
                // Пробуем загрузить из внешнего файла конфигурации
                try (InputStream input = new FileInputStream(pathToConfig)) {
                    props.load(input);
                    return props;
                } catch (Exception ex) {
                    System.out.println("Не удалось загрузить конфиг из: " + pathToConfig);
                }
            }

            // Загружаем из classpath если внешний файл не указан или не удалось загрузить
            try (InputStream input = PropertiesConfig.class.getClassLoader()
                                                           .getResourceAsStream("application.properties")) {
                if (input != null) {
                    props.load(input);
                } else {
                    throw new IllegalStateException("application.properties не найден в classpath");
                }
            }
        } catch (Exception ex) {
            throw new IllegalStateException("Не удалось загрузить конфигурацию", ex);
        }

        return props;
    }
}
