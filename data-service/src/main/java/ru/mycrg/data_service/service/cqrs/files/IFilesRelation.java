package ru.mycrg.data_service.service.cqrs.files;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

public interface IFilesRelation {

    @NotNull
    SchemaDto getSchema();

    @NotNull
    ResourceQualifier getQualifier();
}
