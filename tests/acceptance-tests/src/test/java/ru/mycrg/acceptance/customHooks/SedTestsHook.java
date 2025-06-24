package ru.mycrg.acceptance.customHooks;

import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import org.junit.Assume;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class SedTestsHook {

    private static final Properties properties;

    static {
        properties = new Properties();
        try (InputStream input = SedTestsHook.class.getClassLoader()
                                                   .getResourceAsStream("application.properties")) {
            if (input != null) {
                properties.load(input);
            }
        } catch (IOException e) {
            throw new RuntimeException("Не удалось загрузить application.properties", e);
        }
    }

    @Before("@SedIntegration")
    public void checkSedTestsEnabled(Scenario scenario) {
        boolean sedTestsEnabled = isSedTestsEnabled();

        if (!sedTestsEnabled) {
            System.out.println("SED тесты отключены в конфигурации. Пропускаем сценарий: " + scenario.getName());
        }

        // Используем Assume для пропуска теста, если SED тесты отключены
        Assume.assumeTrue("SED тесты отключены в application.properties", sedTestsEnabled);
    }

    private boolean isSedTestsEnabled() {
        // Сначала проверяем системное свойство, потом application.properties
        String systemProperty = System.getProperty("sed.tests.enabled");
        if (systemProperty != null) {
            return Boolean.parseBoolean(systemProperty);
        }

        String value = properties.getProperty("sed.tests.enabled");
        return value == null || Boolean.parseBoolean(value);
    }
}
