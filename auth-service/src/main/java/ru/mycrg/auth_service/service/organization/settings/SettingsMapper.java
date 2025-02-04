package ru.mycrg.auth_service.service.organization.settings;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service_contract.dto.OrgSettingsRequestDto;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static ru.mycrg.auth_service.AuthJWTApplication.mapper;

public class SettingsMapper {

    private static final Logger log = LoggerFactory.getLogger(SettingsMapper.class);

    public static Set<OrgSettingsRequestDto> mapToSystemSettings(JsonNode jsonNode) {
        if (jsonNode == null) {
            return new HashSet<>();
        }

        try {
            return mapper.readValue(jsonNode.toString(),
                                    new TypeReference<Set<OrgSettingsRequestDto>>() {
                                    });
        } catch (Exception e) {
            String msg = String.format("Не удалось прочесть настройки всех организаций: '%s' из БД. Причина: %s",
                                       jsonNode, e.getMessage());
            log.error(msg, e);

            throw new AuthServiceException(msg);
        }
    }

    public static Map<String, Object> mapToSettings(JsonNode jsonNode) {
        if (jsonNode == null) {
            return new HashMap<>();
        }

        try {
            return mapper.readValue(jsonNode.toString(), Map.class);
        } catch (Exception e) {
            String msg = String.format("Не удалось прочесть настройки организации: '%s'. Причина: %s",
                                       jsonNode, e.getMessage());
            log.error(msg, e);

            throw new AuthServiceException(msg);
        }
    }
}
