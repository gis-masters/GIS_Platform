package ru.mycrg.data_service.service.cqrs.files.handlers;

import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.FileProjection;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.binary_analyzers.SimpleIntentHandler;
import ru.mycrg.data_service.service.cqrs.files.requests.CreateFileRequest;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.mediator.IRequestHandler;

import java.util.ArrayList;
import java.util.List;

@Component
public class CreateFileHandler implements IRequestHandler<CreateFileRequest, List<FileProjection>> {

    private final FileRepository fileRepository;
    private final ProjectionFactory projectionFactory;
    private final FileStorageService fileStorageService;
    private final IAuthenticationFacade authenticationFacade;
    private final SimpleIntentHandler simpleIntentHandler;

    public CreateFileHandler(FileRepository fileRepository,
                             ProjectionFactory projectionFactory,
                             FileStorageService fileStorageService,
                             IAuthenticationFacade authenticationFacade,
                             SimpleIntentHandler simpleIntentHandler) {
        this.fileRepository = fileRepository;
        this.projectionFactory = projectionFactory;
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
                String path = fileStorageService.storeFile(file, fileStorageService.generateFileName(file));
                String intents = simpleIntentHandler.defineIntent(file);

                File entity = new File(file, intents, path, authenticationFacade.getLogin());
                File savedEntity = fileRepository.save(entity);

                fileProjections.add(projectionFactory.createProjection(FileProjection.class, savedEntity));
            }
        }

        return fileProjections;
    }
}
