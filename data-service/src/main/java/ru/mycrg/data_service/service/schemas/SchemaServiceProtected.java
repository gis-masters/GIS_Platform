package ru.mycrg.data_service.service.schemas;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.service.OrgSettingsKeeper;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Данный сервис фильтрует схемы на основе настроек организации.
 * <p>
 * Схемы скрытые настройками будут недоступны.
 */
@Service
@Primary
public class SchemaServiceProtected implements ISchemaService {

    private final ISchemaService schemaService;
    private final OrgSettingsKeeper orgSettingsKeeper;

    public SchemaServiceProtected(@Qualifier("schemaServiceBase") ISchemaService schemaServiceBase,
                                  OrgSettingsKeeper orgSettingsKeeper) {
        this.schemaService = schemaServiceBase;
        this.orgSettingsKeeper = orgSettingsKeeper;
    }

    @Override
    public List<SchemaDto> getSchemas(@Nullable List<String> featureNames) {
        return schemaService.getSchemas(featureNames).stream()
                            .filter(this::isAllowedBySettings)
                            .collect(Collectors.toList());
    }

    @Override
    public Optional<SchemaDto> getSchemaByName(@NotNull String name) {
        return schemaService.getSchemaByName(name);
    }

    @Override
    public List<SchemaDto> getSchemasWithReglaments() {
        return schemaService.getSchemasWithReglaments();
    }

    @Override
    public List<SchemaDto> getBySpecificProperty(String propertyName) {
        return schemaService.getBySpecificProperty(propertyName);
    }

    @Override
    public boolean isSchemaExist(String name) {
        return schemaService.isSchemaExist(name);
    }

    /**
     * Когда включены все приказы то возращаем все схемы
     * <p>
     * Когда все приказы вЫключены то возращаем все схемы которые без тегов
     * <p>
     * Когда вЫключен "приказ 10" то возращаем все схемы которые без тегов и 123 приказ
     * <p>
     * Когда вЫключен "приказ 123" то возращаем все схемы которые без тегов и 10 приказ
     */
    private boolean isAllowedBySettings(SchemaDto schema) {
        boolean order10Allowed = orgSettingsKeeper.isOrder10Allowed();
        boolean order123Allowed = orgSettingsKeeper.isOrder123Allowed();

        List<String> tags = schema.getTags();
        if (tags.isEmpty() || !tags.contains("system")) {
            return true;
        }

        if (order10Allowed && tags.contains("Приказ 10") || order123Allowed && tags.contains("Приказ 123")) {
            return true;
        }

        return false;
    }
}
