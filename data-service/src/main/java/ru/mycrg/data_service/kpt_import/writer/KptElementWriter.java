package ru.mycrg.data_service.kpt_import.writer;

import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;

/**
 * Сохраняет элемент слоя КПТ
 */
public interface KptElementWriter {

    void writeBatch(List<KptElement> kptElements, SchemaDto tableSchemaDto, String databaseName);

    Class<? extends KptElement> getTargetClass();
}
