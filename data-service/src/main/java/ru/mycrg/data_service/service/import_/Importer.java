package ru.mycrg.data_service.service.import_;

import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

public interface Importer {

    void doImport(MultipartFile file, ResourceIdentifier rIdentifier);
}
