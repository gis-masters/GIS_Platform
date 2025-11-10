package ru.mycrg.acceptance.loaders;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import static ru.mycrg.acceptance.BaseStepsDefinitions.gson;

public class JsonLoader {

    /**
     * Загружает JSON из ресурса и десериализует в указанный класс
     *
     * @param resourcePath путь к ресурсу (например, "schemas/schema.json")
     * @param clazz        класс для десериализации
     * @param <T>          тип возвращаемого объекта
     *
     * @return десериализованный объект
     */
    public static <T> T loadFromResource(String resourcePath, Class<T> clazz) {
        try (InputStream inputStream = JsonLoader.class.getClassLoader().getResourceAsStream(resourcePath)) {
            if (inputStream == null) {
                throw new RuntimeException("Resource not found: " + resourcePath);
            }

            String json = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            return gson.fromJson(json, clazz);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load JSON from resource: " + resourcePath, e);
        }
    }

    /**
     * Загружает JSON из ресурса и возвращает как строку
     *
     * @param resourcePath путь к ресурсу
     *
     * @return содержимое файла как строка
     */
    public static String loadAsString(String resourcePath) {
        try (InputStream inputStream = JsonLoader.class.getClassLoader().getResourceAsStream(resourcePath)) {
            if (inputStream == null) {
                throw new RuntimeException("Resource not found: " + resourcePath);
            }

            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load JSON from resource: " + resourcePath, e);
        }
    }
}
