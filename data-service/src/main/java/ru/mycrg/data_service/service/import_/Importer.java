package ru.mycrg.data_service.service.import_;

import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.service.import_.dto.ImportInitializingModel;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

public interface Importer<T> {

    T doImport(MultipartFile file, ResourceQualifier rIdentifier);

    ImportType getType();

    Importer<T> validate();

    Importer<T> setPayload(ImportInitializingModel importInitialData, IRecord record);
}
