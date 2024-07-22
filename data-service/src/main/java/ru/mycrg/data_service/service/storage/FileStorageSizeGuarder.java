package ru.mycrg.data_service.service.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.service.OrgSettingsKeeper;

import java.util.Arrays;

import static ru.mycrg.data_service.service.storage.FileStorageUtil.readableFileSize;

@Component
public class FileStorageSizeGuarder {

    private static final Logger log = LoggerFactory.getLogger(FileStorageSizeGuarder.class);

    private static final long ONE_GIGABYTE_IN_BYTES = 1_073_741_824L;

    private final OrgSettingsKeeper orgSettingsKeeper;
    private final FileStorageService fileStorageService;

    public FileStorageSizeGuarder(OrgSettingsKeeper orgSettingsKeeper,
                                  FileStorageService fileStorageService) {
        this.orgSettingsKeeper = orgSettingsKeeper;
        this.fileStorageService = fileStorageService;
    }

    public boolean isTooLarge(MultipartFile[] files) {
        int storageSizeFromSettings = orgSettingsKeeper.getStorageSize();
        if (storageSizeFromSettings == -1) {
            return false;
        }

        long filesSize = Arrays.stream(files).mapToLong(MultipartFile::getSize).sum();
        long allowedStorageSize = storageSizeFromSettings * ONE_GIGABYTE_IN_BYTES;
        long currentStorageSize = fileStorageService.mainStorageOccupiedSpace();

        if (allowedStorageSize - (currentStorageSize + filesSize) < 0) {
            log.debug("FileStorageSizeGuarder: \n" +
                              "Доступно для хранения:    '{}' bytes. ({})\n" +
                              "Текущий размер хранилища: '{}' bytes. ({}) \n" +
                              "Размер файлов:            '{}' bytes. ({})",
                      allowedStorageSize, readableFileSize(allowedStorageSize),
                      currentStorageSize, readableFileSize(currentStorageSize),
                      filesSize, readableFileSize(filesSize));

            return true;
        }

        return false;
    }
}
