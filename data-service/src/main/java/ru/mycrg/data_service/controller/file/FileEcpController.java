package ru.mycrg.data_service.controller.file;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse;
import ru.mycrg.data_service.controller.BaseController;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.ecp.EcpVerifier;
import ru.mycrg.data_service.service.ecp.FileSigner;
import ru.mycrg.data_service.service.ecp.HashCalculator;
import ru.mycrg.data_service.service.resources.protectors.IFileResourceProtector;

import java.util.List;
import java.util.UUID;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.service.files.FileUtil.getFileAsBytes;

@RestController
@RequestMapping("/files")
public class FileEcpController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(FileEcpController.class);

    private final FileSigner fileSigner;
    private final EcpVerifier ecpVerifier;
    private final FileRepository fileRepository;
    private final HashCalculator hashCalculator;
    private final IFileResourceProtector fileResourceProtector;

    public FileEcpController(FileSigner fileSigner,
                             EcpVerifier ecpVerifier,
                             FileRepository fileRepository,
                             HashCalculator hashCalculator,
                             IFileResourceProtector fileResourceProtector) {
        this.fileSigner = fileSigner;
        this.ecpVerifier = ecpVerifier;
        this.fileRepository = fileRepository;
        this.hashCalculator = hashCalculator;
        this.fileResourceProtector = fileResourceProtector;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/{id}/sign")
    public ResponseEntity<?> sign(@PathVariable UUID id,
                                  @RequestPart MultipartFile sign) {
        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));
        if (!fileResourceProtector.isAllowed(file)) {
            throw new ForbiddenException("Файл недоступен");
        }

        fileSigner.sign(file, sign);

        return ResponseEntity.ok().build();
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/{id}/verify")
    public ResponseEntity<List<VerifyEcpResponse>> verifyFile(@PathVariable UUID id) {
        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));
        if (!fileResourceProtector.isAllowed(file)) {
            throw new ForbiddenException("Файл недоступен");
        }

        if (file.getEcp() == null) {
            throw new BadRequestException("Файл: '" + file.getTitle() + "' не подписан");
        }

        List<VerifyEcpResponse> result = ecpVerifier.verify(file.getPath(), file.getEcp());

        return ResponseEntity.ok(result);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/{fileId}/verify/{ecpId}")
    public ResponseEntity<List<VerifyEcpResponse>> verifyFileByEcp(@PathVariable UUID fileId,
                                                                   @PathVariable UUID ecpId) {
        File file = fileRepository.findById(fileId)
                                  .orElseThrow(() -> new NotFoundException(fileId));
        if (!fileResourceProtector.isAllowed(file)) {
            throw new ForbiddenException("Файл недоступен");
        }

        File ecp = fileRepository.findById(ecpId)
                                 .orElseThrow(() -> new NotFoundException(ecpId));
        if (!fileResourceProtector.isAllowed(file)) {
            throw new ForbiddenException("Файл недоступен");
        }

        List<VerifyEcpResponse> result = ecpVerifier.verify(file.getPath(), getFileAsBytes(ecp));

        return ResponseEntity.ok(result);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/{id}/hash")
    public ResponseEntity<String> calculateHash(@PathVariable UUID id) {
        log.info("Запрос hash для файла: {}", id);

        File file = fileRepository.findById(id)
                                  .orElseThrow(() -> new NotFoundException(id));
        if (!fileResourceProtector.isAllowed(file)) {
            throw new ForbiddenException("Файл недоступен");
        }

        String hash = hashCalculator.calculate(file.getPath());

        return ResponseEntity.ok(hash);
    }
}
