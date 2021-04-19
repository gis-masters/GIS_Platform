package ru.mycrg.data_service.service;

import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.HashMap;
import java.util.Map;

public class XmlFileParser {

    public static Map<String, Object> parseXmlFileWithScheme(MultipartFile xmlFile, SchemaDto schemaDto) {
        Map<String, Object> dataForDB = new HashMap<>();

        return dataForDB;
    }
}
