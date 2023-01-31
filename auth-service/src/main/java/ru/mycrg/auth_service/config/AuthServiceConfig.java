package ru.mycrg.auth_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class AuthServiceConfig {

    @Bean
    public Map<String, String> knownSettings() {
        Map<String, String> knownSettings = new HashMap<>();
        knownSettings.put("createLibraryItem", "Создание элементов в библиотеке");
        knownSettings.put("dataManagement", "Управление данными");
        knownSettings.put("downloadXml", "Скачивание xml межевого плана и выгрузка координат и геометрии");
        knownSettings.put("downloadFiles", "Скачать документ");

        knownSettings.put("createProject", "Создание проекта");
        knownSettings.put("editProjectLayer", "Настройка слоев проекта");
        knownSettings.put("sedDialog", "СЭД Диалог");
        knownSettings.put("reestrs", "Реестры");

        return knownSettings;
    }
}
