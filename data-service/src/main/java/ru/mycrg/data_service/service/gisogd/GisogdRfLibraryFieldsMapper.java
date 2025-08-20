package ru.mycrg.data_service.service.gisogd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.lang.String.format;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultOrganizationName;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

/**
 * Мы храним для организации в файле gisogdrfFields.json маппинг наших библиотек и их полей отправляемых в ГИСОГД РФ
 */
@Component
public class GisogdRfLibraryFieldsMapper {

    private static final Logger log = LoggerFactory.getLogger(GisogdRfLibraryFieldsMapper.class);

    private static final String FILE_WITH_FIELDS = "gisogdrfFields.json";

    private final IAuthenticationFacade authenticationFacade;

    private final Map<String, Map<String, List<String>>> cache = new HashMap<>();

    @Value("${crg-options.mainStoragePath}")
    private String mainStoragePath;

    public GisogdRfLibraryFieldsMapper(IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    /**
     * @param libraryName Название библиотеки
     * @param content     Исходные данные
     *
     * @return В записи остаются только те поля, что должны быть отправлены в ГИСОГД РФ согласно маппинга.
     */
    public Map<String, Object> mapBySettings(String libraryName, Map<String, Object> content) {
        Map<String, List<String>> data = readMappingData();

        List<String> fields = data.get(libraryName);
        if (fields == null || fields.isEmpty()) {
            log.warn("Для библиотеки: '{}' в файле конфигурации: '{}' не заданы поля!!!", libraryName,
                     FILE_WITH_FIELDS);

            return content;
        }

        Map<String, Object> result = new HashMap<>();
        for (String key: fields) {
            result.put(key, content.get(key));
        }

        return result;
    }

    private Map<String, List<String>> readMappingData() {
        Path pathToFile = Path.of(format("%s/%s/%s",
                                         mainStoragePath,
                                         getDefaultOrganizationName(authenticationFacade.getOrganizationId()),
                                         FILE_WITH_FIELDS));

        if (cache.containsKey(pathToFile.toString())) {
            return cache.getOrDefault(pathToFile.toString(), new HashMap<>());
        }

        try {
            Map<String, List<String>> data = mapper.readValue(Files.readAllBytes(pathToFile), HashMap.class);

            cache.put(pathToFile.toString(), data);
        } catch (Exception e) {
            String msg = format("Не удалось считать данные из файла: [%s] По причине: %s", pathToFile, e.getMessage());
            log.error(msg, e);
        }

        return new HashMap<>();
    }
}
