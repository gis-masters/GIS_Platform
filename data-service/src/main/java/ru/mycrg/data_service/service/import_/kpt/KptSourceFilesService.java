package ru.mycrg.data_service.service.import_.kpt;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import ru.mycrg.data_service_contract.dto.TypeDocumentData;

import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;

/**
 * Сервис поиска файлов-источников для импорта КПТ из XML
 */
@Service
public class KptSourceFilesService {

    private static final Logger log = LoggerFactory.getLogger(KptSourceFilesService.class);

    public static final String KPT_LIBRARY_ID = "dl_data_kpt";
    private static final String FILE_PROPERTY = "file";
    private static final String DATA_ORDER_COMPLETION_PROPERTY = "date_order_completion";

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
     *
     * @return Пара из файлов источников и даты "свежести" кпт
     */
    public Pair<List<ImportSourceFileDto>, String> getSourceFiles(IRecord kptRecord) {
        SchemaDto kptLibSchema = documentLibraryService.getSchema(KPT_LIBRARY_ID);
        List<ImportSourceFileDto> sourceFiles;
        if (kptRecord.isFolder()) {
            sourceFiles = getSourceFilesByDirectory(kptRecord, kptLibSchema);
        } else {
            sourceFiles = Collections.singletonList(getSingleSourceFile(kptRecord));
        }
        return new ImmutablePair<>(sourceFiles, (String) kptRecord.getContent().get(DATA_ORDER_COMPLETION_PROPERTY));
    }

    public IRecord getKptRecord(long kptId) {
        ResourceQualifier qualifier = new ResourceQualifier(
                SYSTEM_SCHEMA_NAME, KPT_LIBRARY_ID, kptId, LIBRARY_RECORD
        );
        return recordServiceFactory.get().getById(qualifier, kptId);
    }

    /**
     * Ищет файл, привязанный к документу КПТ
     */
    private ImportSourceFileDto getSingleSourceFile(IRecord kptRecord) {
        FileDescription fileDescription = extractKptFileDescription(kptRecord).orElseThrow(
                () -> new IllegalStateException("Не приложен файл для импорта КПТ id=" + kptRecord.getId())
        );
        File file = fileRepository.findById(fileDescription.getId()).orElseThrow(
                () -> new DataServiceException("Не найден файл fileId=" + fileDescription.getId())
        );
        ImportSourceFileDto fileDto = fileToImportSourceFileDto(file, kptRecord);
        if (fileDto.getPath() == null || fileDto.getPath().isBlank()) {
            throw new IllegalStateException("Пустой путь к файлу для импорта КПТ fileId=" + file.getId());
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

        List<IRecord> kptRecords = recordsDao.findAll(resourceQualifier, filter, kptLibSchema);
        Set<UUID> fileIds = kptRecords
                .stream()
                .map(this::extractKptFileDescription)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(FileDescription::getId)
                .collect(Collectors.toSet());
        List<File> files = fileRepository.findAllByIdIn(fileIds);
        return files.stream()
                    .map(file -> fileToImportSourceFileDto(file, findKptRecordByFileId(kptRecords, file.getId())))
                    .collect(Collectors.toList());
    }

    private IRecord findKptRecordByFileId(List<IRecord> kptRecords, UUID fileId) {
        return kptRecords.stream()
                         .filter(rec -> {
                             Optional<FileDescription> fd = extractKptFileDescription(rec);
                             return fd.filter(fileDescription -> fileId.equals(fileDescription.getId())).isPresent();
                         })
                         .findFirst()
                         .get();
    }

    private Optional<FileDescription> extractKptFileDescription(IRecord kptRecord) {
        List<FileDescription> filesDescriptions = (List<FileDescription>) kptRecord.getContent().get(FILE_PROPERTY);
        if (filesDescriptions == null || filesDescriptions.isEmpty()) {
            int id = (int) kptRecord.getContent()
                                    .get(SystemLibraryAttributes.ID.getName());
            log.warn("Невозможно определить файл для импорта кпт с id = " + id);
            return Optional.empty();
        }
        return Optional.of(filesDescriptions.get(0));
    }

    private ImportSourceFileDto fileToImportSourceFileDto(File file, IRecord kptRecord) {
        TypeDocumentData typeDocumentData = new TypeDocumentData();
        typeDocumentData.setId(kptRecord.getId());
        typeDocumentData.setTitle(kptRecord.getTitle());
        typeDocumentData.setLibraryTableName(KPT_LIBRARY_ID);
        return new ImportSourceFileDto(
                file.getId(),
                file.getPath(),
                typeDocumentData
        );
    }
}
