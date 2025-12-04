package ru.mycrg.data_service.service.files;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.common_contracts.generated.data_service.FileMetadata;
import ru.mycrg.data_service.entity.File;

public interface IMetadataExtractor {

    String DEFAULT_TYPE = "*";

    default FileMetadata<?> extract(@NotNull File file) throws MetadataExtractionException {
        return new FileMetadata<>(file.getId(), null);
    }

    default String getType() {
        return DEFAULT_TYPE;
    }
}
