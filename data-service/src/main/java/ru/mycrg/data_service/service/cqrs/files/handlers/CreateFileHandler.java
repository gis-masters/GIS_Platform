package ru.mycrg.data_service.service.cqrs.files.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.FileProjection;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.binary_analyzers.SimpleIntentHandler;
import ru.mycrg.data_service.service.cqrs.files.requests.CreateFileRequest;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.mediator.IRequestHandler;

import java.util.ArrayList;
import java.util.List;

import static ru.mycrg.data_service.service.storage.FileStorageUtil.generateFileName;

@Component
public class CreateFileHandler implements IRequestHandler<CreateFileRequest, List<FileProjection>> {

    private static final Logger log = LoggerFactory.getLogger(CreateFileHandler.class);

    private final FileRepository fileRepository;
    private final FileStorageService fileStorageService;
    private final IAuthenticationFacade authenticationFacade;
    private final SimpleIntentHandler simpleIntentHandler;

    public CreateFileHandler(FileRepository fileRepository,
                             FileStorageService fileStorageService,
                             IAuthenticationFacade authenticationFacade,
                             SimpleIntentHandler simpleIntentHandler) {
        this.fileRepository = fileRepository;
        this.fileStorageService = fileStorageService;
        this.simpleIntentHandler = simpleIntentHandler;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public List<FileProjection> handle(CreateFileRequest request) {
        List<FileProjection> fileProjections = new ArrayList<>();

        MultipartFile[] files = request.getFiles();
        for (MultipartFile file: files) {
            if (file != null && !file.isEmpty()) {
                String path = fileStorageService.copyToTrash(file, generateFileName(file));
                String intents = simpleIntentHandler.defineIntent(file);

                File entity = new File(file, intents, path, authenticationFacade.getLogin());
                File savedEntity = fileRepository.save(entity);

                fileProjections.add(new FileProjection(savedEntity));
            } else {
                log.debug("Файл: '{}' пуст", file == null ? "unknown" : file.getName());
            }
        }

        if (fileProjections.isEmpty()) {
            throw new BadRequestException("Переданные файлы не корректны");
        }

        return fileProjections;
    }
}
