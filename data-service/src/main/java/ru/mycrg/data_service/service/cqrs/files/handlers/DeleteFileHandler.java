package ru.mycrg.data_service.service.cqrs.files.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.repository.ProcessRepository;
import ru.mycrg.data_service.service.cqrs.files.requests.DeleteFileRequest;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.StorageException;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;
import tools.jackson.databind.JsonNode;

import java.util.List;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.PENDING;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Component
public class DeleteFileHandler implements IRequestHandler<DeleteFileRequest, Voidy> {

    private static final Logger log = LoggerFactory.getLogger(DeleteFileHandler.class);
    private static final List<String> IMPORT_STATUSES_BLOCKING_DELETE = List.of(
            PENDING.name(),
            TASK_DONE.name(),
            TASK_ERROR.name());

    private final FileRepository fileRepository;
    private final ProcessRepository processRepository;
    private final FileStorageService fileStorageService;
    private final IAuthenticationFacade authenticationFacade;

    public DeleteFileHandler(FileRepository fileRepository,
                             ProcessRepository processRepository,
                             FileStorageService fileStorageService,
                             IAuthenticationFacade authenticationFacade) {
        this.fileRepository = fileRepository;
        this.processRepository = processRepository;
        this.fileStorageService = fileStorageService;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Voidy handle(DeleteFileRequest request) {
        File file = fileRepository.findById(request.getId())
                                  .orElseThrow(() -> new NotFoundException(request.getId()));

        String createdBy = file.getCreatedBy();
        if (createdBy == null || !authenticationFacade.getLogin().equalsIgnoreCase(createdBy)) {
            throw new ForbiddenException("Удалить можно только свой файл");
        }

        if (isBoundToResource(file)) {
            throw new ConflictException("Нельзя удалить файл, привязанный к ресурсу");
        }

        if (processRepository.existsImportByFileId(IMPORT.name(),
                                                   IMPORT_STATUSES_BLOCKING_DELETE,
                                                   file.getId().toString())) {
            throw new ConflictException("Нельзя удалить файл, пока идёт импорт");
        }

        String filePath = file.getPath();
        fileRepository.delete(file);

        try {
            fileStorageService.deleteIfExists(filePath);
        } catch (StorageException e) {
            log.warn("Запись файла {} удалена, физический файл по пути {} удалить не удалось: {}",
                     request.getId(), filePath, e.getMessage());
        }

        return new Voidy();
    }

    private boolean isBoundToResource(File file) {
        String resourceType = file.getResourceType();
        if (resourceType != null && !resourceType.isBlank()) {
            return true;
        }

        JsonNode resourceQualifier = file.getResourceQualifier();

        return resourceQualifier != null && !resourceQualifier.isNull();
    }
}
