package ru.mycrg.acceptance.configs;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

public class GeneralEnvironmentsConfig {

    private static Properties configCache = null;

    private static Properties loadConfigFromFile() {
        if (configCache != null) {
            return configCache;
        }

        configCache = new Properties();
        String configFile = System.getProperty("config.file");

        if (configFile == null) {
            // Попробуем загрузить application.properties как fallback (для IDE)
            loadApplicationProperties();
            return configCache;
        }

        try {
            Path path = Paths.get(configFile);
            if (!Files.exists(path)) {
                return configCache;
            }

            try (InputStream is = Files.newInputStream(path)) {
                configCache.load(is);
            }
        } catch (Exception e) {
            throw new IllegalStateException("Ошибка чтения: " + configFile);
        }

        return configCache;
    }

    public static String getConfigValue(String key, String defaultValue) {
        Properties config = loadConfigFromFile();

        // Сначала пробуем получить из системных свойств
        String value = System.getProperty(key);
        if (value != null) {
            return value;
        }

        // Затем из конфигурационного файла
        value = config.getProperty(key);
        if (value != null) {
            return value;
        }

        return defaultValue;
    }

    public static String getConfigValue(String key) {
        return getConfigValue(key, null);
    }

    private static void loadApplicationProperties() {
        try {
            // Попробуем найти application.properties в classpath
            try (InputStream is = GeneralEnvironmentsConfig.class.getClassLoader()
                                                                 .getResourceAsStream("application.properties")) {
                if (is != null) {
                    configCache.load(is);
                }
            }
        } catch (Exception e) {
            throw new IllegalStateException("Ошибка при чтении application.properties: " + e.getMessage());
        }
    }
}
