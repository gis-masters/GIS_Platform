package ru.mycrg.data_service.service.import_.kpt;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.SystemLibraryAttributes;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.ImportSourceFileDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;

/**
 * Сервис поиска файлов-источников для импорта КПТ из XML
 */
@Service
public class KptSourceFilesService {

    private static final String KPT_LIBRARY_ID = "dl_data_kpt";
    private static final String FILE_PROPERTY = "file";

    private final RecordServiceFactory recordServiceFactory;
    private final FileRepository fileRepository;
    private final RecordsDao recordsDao;
    private final DocumentLibraryService documentLibraryService;

    public KptSourceFilesService(RecordServiceFactory recordServiceFactory,
                                 FileRepository fileRepository,
                                 RecordsDao recordsDao,
                                 DocumentLibraryService documentLibraryService) {
        this.recordServiceFactory = recordServiceFactory;
        this.fileRepository = fileRepository;
        this.recordsDao = recordsDao;
        this.documentLibraryService = documentLibraryService;
    }

    /**
     * Ищет файлы на жестком диске, привязанные к папке или документу КПТ
     */
    public List<ImportSourceFileDto> getSourceFiles(long kptId) {
        SchemaDto kptLibSchema = documentLibraryService.getSchema(KPT_LIBRARY_ID);
        IRecord kptRecord = getKptRecord(kptId);
        if (kptRecord == null) {
            throw new DataServiceException("Не найден КПТ id=" + kptId);
        }
        List<ImportSourceFileDto> sourceFiles;
        if (kptRecord.isFolder()) {
            sourceFiles = getSourceFilesByDirectory(kptRecord, kptLibSchema);
        } else {
            sourceFiles = Collections.singletonList(getSingleSourceFile(kptRecord));
        }
        return sourceFiles;
    }

    private IRecord getKptRecord(long kptId) {
        ResourceQualifier qualifier = new ResourceQualifier(
                SYSTEM_SCHEMA_NAME, KPT_LIBRARY_ID, kptId, LIBRARY_RECORD
        );
        return recordServiceFactory.get().getById(qualifier, kptId);
    }

    /**
     * Ищет файл, привязанный к документу КПТ
     */
    private ImportSourceFileDto getSingleSourceFile(IRecord kptRecord) {
        FileDescription fileDescription = extractKptFileDescription(kptRecord);
        File file = fileRepository.findById(fileDescription.getId()).orElseThrow();
        ImportSourceFileDto fileDto = fileToImportSourceFileDto(file);
        if (fileDto.getPath() == null) {
            throw new IllegalStateException("Не приложен файл для импорта КПТ id=" + kptRecord.getId());
        }
        return fileDto;
    }

    /**
     * Ищет файлы, привязанные к документам КПТ внутри директории
     */
    private List<ImportSourceFileDto> getSourceFilesByDirectory(IRecord kptRecord, SchemaDto kptLibSchema) {
        ResourceQualifier resourceQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, KPT_LIBRARY_ID);
        String pathProperty = SystemLibraryAttributes.PATH.getName();
        String directoryPath = (String) kptRecord.getContent().get(pathProperty);
        int directoryId = (int) kptRecord.getContent().get(SystemLibraryAttributes.ID.getName());
        String filter = String.format("%s like '%s/%d'", pathProperty, directoryPath, directoryId);

        Set<UUID> fileIds = recordsDao.findAll(resourceQualifier, filter, kptLibSchema)
                                      .stream()
                                      .map(this::extractKptFileDescription)
                                      .map(FileDescription::getId)
                                      .collect(Collectors.toSet());

        return fileRepository.findAllByIdIn(fileIds)
                             .stream()
                             .map(this::fileToImportSourceFileDto)
                             .filter(file -> file.getPath() != null)
                             .collect(Collectors.toList());
    }

    private FileDescription extractKptFileDescription(IRecord kptRecord) {
        List<FileDescription> filesDescriptions = (List<FileDescription>) kptRecord.getContent().get(FILE_PROPERTY);
        if (filesDescriptions.isEmpty()) {
            int id = (int) kptRecord.getContent()
                                    .get(SystemLibraryAttributes.ID.getName());
            throw new DataServiceException("Невозможно определить файл для импорта кпт с id = " + id);
        }
        return filesDescriptions.get(0);
    }

    private ImportSourceFileDto fileToImportSourceFileDto(File file) {
        return new ImportSourceFileDto(file.getId(), file.getPath(), file.getCreatedAt());
    }
}
