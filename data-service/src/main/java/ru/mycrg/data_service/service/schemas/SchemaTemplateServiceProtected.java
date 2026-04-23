package ru.mycrg.data_service.service.schemas;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.SchemaTemplateProjection;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.service.OrgSettingsKeeper;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.AbstractMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.mappers.SchemaEntityMapper.mapToSchemaDto;

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
        return schemaService.getSchemaTemplatesProjection(featureNames).stream()
                            .map(template -> new AbstractMap.SimpleEntry<>(template,
                                                                           mapToSchemaDto(template)))
                            .filter(entry -> isAllowedByTags(entry.getValue(),
                                                             Optional.ofNullable(entry.getKey().getSystem())
                                                                     .orElse(false)))
                            .map(Map.Entry::getValue)
                            .collect(Collectors.toList());
    }

    @Override
    public List<SchemaTemplateProjection> getSchemaTemplatesProjection(@Nullable List<String> featureNames) {
        return schemaService.getSchemaTemplatesProjection(featureNames)
                            .stream()
                            .filter(template -> isAllowedByTags(
                                    mapToSchemaDto(template),
                                    Optional.ofNullable(template.getSystem()).orElse(false))
                            )
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
     * Проверка касается только системных схем - с признаком 'isSystem == true'. Если схема не системная она разрешена.
     * Для системных схем проверяется наличие тегов среди разрешенных. Если найден хотя бы один разрешенный тег - схема
     * разрешена.
     */
    private boolean isAllowedByTags(SchemaDto schema, boolean isSystem) {
        if (schema == null) {
            return false;
        }

        List<String> tags = schema.getTags();
        if (tags.isEmpty() || !isSystem) {
            return true;
        }

        for (String tag: tags) {
            if (orgSettingsKeeper.isTagAllowed(tag)) {
                return true;
            }
        }

        return false;
    }

    public static void throwIfSchemaSystem(String schemaName, Boolean isSystem) {
        if (Boolean.TRUE.equals(isSystem) || isSystem == null) {
            throw new ForbiddenException("Шаблон схемы является системным!!!",
                                         List.of(new ErrorInfo("system",
                                                               String.format(
                                                                       "Шаблон схемы «%s» является системным." +
                                                                               " Удаление и редактирование запрещено." +
                                                                               " Пожалуйста создайте новый" +
                                                                               " шаблон на основе текущего.",
                                                                       schemaName))));
        }
    }

    public static void throwIfHaveNoAccess(boolean isOrgAdmin, String createdBy, String currentUser) {
        if (isOrgAdmin) {
            return;
        }

        if (createdBy.equals(currentUser)) {
            return;
        }

        throw new ForbiddenException("Не хватает прав доступа для редактирования шаблона схемы!!!",
                                     List.of(new ErrorInfo("access",
                                                           String.format(
                                                                   "Указанный шаблон схемы может редактировать " +
                                                                           "только «%s» или администратор." +
                                                                           " Вы можете создать новый шаблон схемы " +
                                                                           "на основе текущей.",
                                                                   createdBy))));
    }
}
