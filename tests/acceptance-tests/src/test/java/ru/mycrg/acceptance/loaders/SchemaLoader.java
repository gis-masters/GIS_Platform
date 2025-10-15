package ru.mycrg.acceptance.loaders;

import ru.mycrg.data_service_contract.dto.SchemaDto;

/**
 * Специализированный загрузчик для схем данных.
 * Использует JsonLoader для загрузки JSON файлов схем из директории schemas/
 */
public class SchemaLoader {
    
    /**
     * Загружает схему из JSON файла в директории schemas/
     * @param fileName название файла схемы (например, "tasks-schema.json")
     * @return загруженная схема
     */
    public static SchemaDto loadSchemaFromResource(String fileName) {
        String resourcePath = "schemas/" + fileName;

        return JsonLoader.loadFromResource(resourcePath, SchemaDto.class);
    }
}
