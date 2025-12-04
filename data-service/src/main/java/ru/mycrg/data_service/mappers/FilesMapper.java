package ru.mycrg.data_service.mappers;

import ru.mycrg.common_contracts.generated.data_service.FileProjection;
import ru.mycrg.data_service.entity.File;

public class FilesMapper {

    public static FileProjection toProjection(File file) {
        return new FileProjection(file.getId(),
                                  file.getTitle(),
                                  file.getSize(),
                                  file.getExtension(),
                                  file.getPath(),
                                  file.getContentType(),
                                  file.getIntents(),
                                  file.getResourceType(),
                                  file.getResourceQualifier(),
                                  file.getCreatedBy(),
                                  file.getCreatedAt(),
                                  file.getEcp() != null && file.getEcp().length > 0,
                                  false);
    }
}
