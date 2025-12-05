package ru.mycrg.data_service.controller.file;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.controller.BaseController;
import ru.mycrg.common_contracts.generated.data_service.FileResponse;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.exceptions.PayloadTooLargeException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.cqrs.files.requests.CreateFileRequest;
import ru.mycrg.data_service.service.resources.protectors.IFileResourceProtector;
import ru.mycrg.data_service.service.storage.FileStorageSizeGuarder;
import ru.mycrg.mediator.Mediator;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.mappers.FilesMapper.toProjection;

@RestController
@RequestMapping("/files")
public class FileCrudController extends BaseController {

    private final Mediator mediator;
    private final FileRepository fileRepository;
    private final FileStorageSizeGuarder fileStorageSizeGuarder;
    private final IFileResourceProtector fileResourceProtector;

    public FileCrudController(FileRepository fileRepository,
                              Mediator mediator,
                              FileStorageSizeGuarder fileStorageSizeGuarder,
                              IFileResourceProtector fileResourceProtector) {
        this.fileRepository = fileRepository;
        this.mediator = mediator;
        this.fileStorageSizeGuarder = fileStorageSizeGuarder;
        this.fileResourceProtector = fileResourceProtector;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping
    public ResponseEntity<List<FileResponse>> createFile(@RequestPart MultipartFile[] files) {
        validateRequest(files);

        if (fileStorageSizeGuarder.isTooLarge(files)) {
            throw new PayloadTooLargeException();
        }

        List<FileResponse> projections = mediator.execute(new CreateFileRequest(files));

        return ResponseEntity.status(CREATED)
                             .body(projections);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/{id}")
    public ResponseEntity<FileResponse> getFile(@PathVariable UUID id) {
        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));
        if (!fileResourceProtector.isAllowed(file)) {
            throw new ForbiddenException("Файл недоступен");
        }

        return ResponseEntity.ok(toProjection(file));
    }

    private void validateRequest(MultipartFile[] files) {
        if (files.length == 0) {
            throw new BadRequestException("Требуемая часть запроса 'files' отсутствует");
        }

        MultipartFile firstFile = files[0];
        if (firstFile != null) {
            String filename = firstFile.getOriginalFilename();
            if (filename == null || filename.isBlank()) {
                throw new BadRequestException("Требуемая часть запроса 'files' отсутствует");
            }
        }
    }
}
