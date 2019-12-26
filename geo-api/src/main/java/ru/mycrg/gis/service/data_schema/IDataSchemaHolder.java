package ru.mycrg.gis.service.data_schema;

import ru.mycrg.mq_queue_contract.SchemaDto;

import java.util.List;
import java.util.Optional;

public interface IDataSchemaHolder {

    List<SchemaDto> getSchemas(List<String> featureNames);

    Optional<SchemaDto> getSchemaByName(String name);

    void update();

    boolean isCacheEmpty();
}
