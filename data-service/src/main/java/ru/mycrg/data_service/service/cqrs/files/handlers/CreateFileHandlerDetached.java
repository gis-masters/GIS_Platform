package ru.mycrg.data_service.service.cqrs.files.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.common_contracts.generated.data_service.FileResponse;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.repository.FileRepositoryDetached;
import ru.mycrg.data_service.service.binary_analyzers.SimpleIntentHandler;
import ru.mycrg.data_service.service.storage.FileStorageService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.mappers.FilesMapper.toProjection;
import static ru.mycrg.data_service.service.storage.FileStorageUtil.generateFileName;

@Component
public class CreateFileHandlerDetached {

    private static final Logger log = LoggerFactory.getLogger(CreateFileHandlerDetached.class);

    private final FileRepositoryDetached fileRepository;
    private final FileStorageService fileStorageService;
    private final SimpleIntentHandler simpleIntentHandler;

    public CreateFileHandlerDetached(FileRepositoryDetached fileRepository,
                                     FileStorageService fileStorageService,
                                     SimpleIntentHandler simpleIntentHandler) {
        this.fileRepository = fileRepository;
        this.fileStorageService = fileStorageService;
        this.simpleIntentHandler = simpleIntentHandler;
    }

    public List<FileResponse> handle(MultipartFile[] files, JdbcTemplate jdbcTemplate, String login) {
        List<FileResponse> fileProjections = new ArrayList<>();

        for (MultipartFile file: files) {
            if (file != null && !file.isEmpty()) {
                String path = fileStorageService.copyToTrash(file, generateFileName(file));
                String intents = simpleIntentHandler.defineIntent(file);

                try {
                    File entity = new File(file, intents, path, login);

                    File savedEntity = fileRepository.save(jdbcTemplate, entity);

                    fileProjections.add(toProjection(savedEntity));
                } catch (Exception e) {
                    log.warn("При создании entity файла произошла ошибка: {}", e.getMessage());

                    throw new BadRequestException(e.getMessage());
                }
            } else {
                log.debug("Файл: '{}' пуст", file == null ? "unknown" : file.getName());
            }
        }

        if (fileProjections.isEmpty()) {
            throw new BadRequestException("Переданные файлы не корректны");
        }

        return fileProjections;
    }

    public Optional<FileResponse> singleFileHandle(MultipartFile file, JdbcTemplate jdbcTemplate, String login) {
        try {
            MultipartFile[] singleFileArray = new MultipartFile[1];
            singleFileArray[0] = file;

            List<FileResponse> subResult = handle(singleFileArray, jdbcTemplate, login);

            return Optional.of(subResult.get(0));
        } catch (Exception e) {

            log.warn("При сохранении одиночного файла возникла ошибка: {}", e.getMessage());

            return Optional.empty();
        }
    }
}
