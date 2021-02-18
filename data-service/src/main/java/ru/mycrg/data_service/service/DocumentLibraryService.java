package ru.mycrg.data_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;

import static ru.mycrg.data_service.dto.Roles.OWNER;

@Service
public class DocumentLibraryService {

    private final DocumentLibraryRepository documentLibraryRepository;

    public DocumentLibraryService(DocumentLibraryRepository documentLibraryRepository) {
        this.documentLibraryRepository = documentLibraryRepository;
    }

    public Page<IResourceModel> getPaged(String title, Pageable pageable, Authentication authentication) {
        return documentLibraryRepository
                .findByTitleContainingIgnoreCase(title, pageable)
                .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER));
    }
}
