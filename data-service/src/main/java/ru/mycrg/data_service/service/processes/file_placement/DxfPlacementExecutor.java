package ru.mycrg.data_service.service.processes.file_placement;

import org.jetbrains.annotations.NotNull;
import org.mozilla.universalchardet.UniversalDetector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.storage.exceptions.StorageException;
import ru.mycrg.data_service.util.FileConverter;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.enums.FileType;

import java.io.IOException;

import static ru.mycrg.data_service_contract.enums.FileType.DXF;

@Component
public class DxfPlacementExecutor implements IExecutor<ImportReport>, IFilePlacer {

    private final Logger log = LoggerFactory.getLogger(DxfPlacementExecutor.class);

    private final String DEFAULT_DXF_STYLE = "dxf_style";

    private final FileRepository fileRepository;
    private final FileStorageService fileStorageService;
    private final FilePlacementExecutor filePlacementExecutor;

    public DxfPlacementExecutor(FileRepository fileRepository,
                                FileStorageService fileStorageService,
                                FilePlacementExecutor filePlacementExecutor) {
        this.fileRepository = fileRepository;
        this.fileStorageService = fileStorageService;
        this.filePlacementExecutor = filePlacementExecutor;
    }

    @Override
    @Transactional
    public ImportReport execute() {
        File file = fileRepository
                .findById(getPayload().getFileId())
                .orElseThrow(() -> new NotFoundException("Не найден файл:" + getPayload().getFileId()));
        file.setPath(changeFileEncoding(file));

        fileRepository.save(file);

        return filePlacementExecutor.execute();
    }

    @Override
    public ImportReport getReport() {
        return filePlacementExecutor.getReport();
    }

    @Override
    public IExecutor<ImportReport> setPayload(ProcessModel processModel) {
        filePlacementExecutor.setPayload(processModel);

        return this;
    }

    @Override
    public FilePlacementPayloadModel getPayload() {
        return filePlacementExecutor.getPayload();
    }

    @Override
    public IExecutor<ImportReport> initialize(Object data) {
        filePlacementExecutor.initialize(data);
        FilePlacementPayloadModel payload = getPayload();
        payload.setStyle(DEFAULT_DXF_STYLE);

        return this;
    }

    @Override
    public IExecutor<ImportReport> validate() {
        // Nothing to do

        return this;
    }

    @Override
    public FileType getFileType() {
        return DXF;
    }

    @Override
    public boolean notDetached() {
        return false;
    }

    @NotNull
    private String changeFileEncoding(File file) {
        String filePath = file.getPath();
        String striped = StringUtils.stripFilenameExtension(filePath);
        String filename = StringUtils.getFilename(filePath);
        String encoding = "_as1251";
        if (!filename.contains(encoding)) {
            String fileEncoding = getFileEncoding(filePath);
            try {
                if ("UTF-8".equalsIgnoreCase(fileEncoding)) {
                    String resultFilePath = striped + encoding + ".dxf";

                    FileConverter.convert(filePath, resultFilePath);
                    fileStorageService.deleteIfExists(filePath);

                    return resultFilePath;
                } else {
                    log.debug("Нет необходимости в конвертации к кодировке 1251");
                }
            } catch (IOException e) {
                log.error("Не удалось конвертировать в кодировку 1251. По причине: {}", e.getMessage(), e);

                throw new DataServiceException("Не удалось обработать файл");
            } catch (StorageException e) {
                log.error("Не удалось удалить временный файл. По причине: {}", e.getMessage(), e);

                throw new DataServiceException("Не удалось обработать файл");
            }

            return filePath;
        }

        return filePath;
    }

    private String getFileEncoding(String path) {
        FileSystemResource fileR = new FileSystemResource(path);
        java.io.File file = fileR.getFile();
        try {
            return UniversalDetector.detectCharset(file);
        } catch (IOException e) {
            String msg = "Не удалось распознать кодировку dxf файла.";
            log.error(msg);

            throw new DataServiceException(msg);
        }
    }
}
