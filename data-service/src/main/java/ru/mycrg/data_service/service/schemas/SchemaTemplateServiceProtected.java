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
public class SchemaTemplateServiceProtected implements ISchemaTemplateService {

    private final ISchemaTemplateService schemaService;
    private final OrgSettingsKeeper orgSettingsKeeper;

    public SchemaTemplateServiceProtected(@Qualifier("schemaTemplateServiceBase")
                                          ISchemaTemplateService schemaServiceBase,
                                          OrgSettingsKeeper orgSettingsKeeper) {
        this.schemaService = schemaServiceBase;
        this.orgSettingsKeeper = orgSettingsKeeper;
    }

    @Override
    public List<SchemaDto> getSchemas(@Nullable List<String> featureNames) {
        return schemaService.getSchemas(featureNames).stream()
                            .filter(this::isAllowedByTags)
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
    public List<String> getSystemTags() {
        return schemaService.getSystemTags();
    }

    @Override
    public boolean isSchemaExist(String name) {
        return schemaService.isSchemaExist(name);
    }

    /**
     * Проверка касается только системных схем - с тегом 'system'. Если схема не содержит системного тега она разрешена.
     * Для системных схем проверяется наличие тегов среди разрешенных. Если найден хотя бы один разрешенный тег - схема
     * разрешена.
     */
    private boolean isAllowedByTags(SchemaDto schema) {
        List<String> tags = schema.getTags();
        if (tags.isEmpty() || !tags.contains("system")) {
            return true;
        }

        for (String tag: tags) {
            if (orgSettingsKeeper.isTagAllowed(tag)) {
                return true;
            }
        }

        return false;
    }
}
