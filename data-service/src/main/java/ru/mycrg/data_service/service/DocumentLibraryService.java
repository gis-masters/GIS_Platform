package ru.mycrg.data_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.mq_queue_contract.SchemaDto;

import java.util.Map;

import static ru.mycrg.data_service.dto.Roles.OWNER;

@Service
public class DocumentLibraryService {

    private final SchemaService schemaService;
    private final DocumentLibraryRepository libraryRepository;

    public DocumentLibraryService(DocumentLibraryRepository libraryRepository,
                                  SchemaService schemaService) {
        this.schemaService = schemaService;
        this.libraryRepository = libraryRepository;
    }

    public Page<IResourceModel> getPaged(String title, Pageable pageable, Authentication authentication) {
        return libraryRepository
                .findByTitleContainingIgnoreCase(title, pageable)
                .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER));
    }

    public SchemaDto getSchema(String docLibId) {
        final DocumentLibrary documentLibrary = libraryRepository
                .findByTableName(docLibId)
                .orElseThrow(() -> new NotFoundException("Not found library: " + docLibId));

        return schemaService
                .getSchemaByName(documentLibrary.getSchemaId())
                .orElseThrow(() -> new NotFoundException("Not found schema for library: " + docLibId));
    }

    public void checkObjectBySchema(Map<String, Object> body, String docLibId) {
        schemaService.checkObjectBySchema(body, docLibId);
    }
}
