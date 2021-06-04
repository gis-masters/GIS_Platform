package ru.mycrg.data_service.service.import_;

import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

public interface Importer {

    Integer doImport(MultipartFile file, ResourceIdentifier rIdentifier);
}
