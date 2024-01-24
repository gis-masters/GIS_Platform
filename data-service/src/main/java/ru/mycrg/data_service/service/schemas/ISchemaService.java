package ru.mycrg.data_service.service.schemas;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Optional;

public interface ISchemaService {

    List<SchemaDto> getSchemas(@Nullable List<String> featureNames);

    Optional<SchemaDto> getSchemaByName(@NotNull String name);

    List<SchemaDto> getSchemasWithReglaments();

    /**
     * Ищем схемы в свойствах которых есть переданное название свойства.
     *
     * @param propertyName Название свойства.
     *
     * @return Список найденных схем.
     */
    List<SchemaDto> getBySpecificProperty(String propertyName);

    boolean isSchemaExist(String name);
}
