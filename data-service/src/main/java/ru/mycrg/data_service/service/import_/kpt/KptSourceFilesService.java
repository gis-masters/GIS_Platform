package ru.mycrg.data_service.service.import_.kpt;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.document_library.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.ImportSourceFileDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;

import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryRecordQualifier;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.ID;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

/**
 * Сервис поиска файлов-источников для импорта КПТ из XML
 */
@Service
public class KptSourceFilesService {

    private static final Logger log = LoggerFactory.getLogger(KptSourceFilesService.class);

    public static final String KPT_LIBRARY_ID = "dl_data_kpt";

    private static final String FILE_PROPERTY = "file";
    private static final String DATA_ORDER_COMPLETION_PROPERTY = "date_order_completion";

    private final RecordsDao recordsDao;
    private final FileRepository fileRepository;
    private final RecordServiceFactory recordServiceFactory;
    private final DocumentLibraryService documentLibraryService;

    public KptSourceFilesService(RecordServiceFactory recordServiceFactory,
                                 FileRepository fileRepository,
                                 RecordsDao recordsDao,
                                 DocumentLibraryService documentLibraryService) {
        this.recordsDao = recordsDao;
        this.fileRepository = fileRepository;
        this.recordServiceFactory = recordServiceFactory;
        this.documentLibraryService = documentLibraryService;
    }

    /**
     * Ищет файлы на жестком диске, привязанные к папке или документу КПТ
     *
     * @return Пара из файлов источников и даты "свежести" кпт
     */
    public Pair<List<ImportSourceFileDto>, String> getSourceFiles(IRecord kptRecord) {
        List<ImportSourceFileDto> sourceFiles;
        if (kptRecord.isFolder()) {
            SchemaDto kptLibSchema = documentLibraryService.getSchema(KPT_LIBRARY_ID);

            sourceFiles = getSourceFilesByDirectory(kptRecord, kptLibSchema);
        } else {
            sourceFiles = Collections.singletonList(getSingleSourceFile(kptRecord));
        }

        return new ImmutablePair<>(sourceFiles, (String) kptRecord.getContent().get(DATA_ORDER_COMPLETION_PROPERTY));
    }

    public IRecord getKptById(long docId) {
        IRecord record = recordServiceFactory
                .get()
                .getById(libraryRecordQualifier(KPT_LIBRARY_ID, docId), docId);

        if (record == null) {
            throw new DataServiceException("Не найден документ: " + docId);
        }

        return record;
    }

    /**
     * Ищет файл, привязанный к документу КПТ
     */
    private ImportSourceFileDto getSingleSourceFile(IRecord record) {
        FileDescription fileDescription = extractKptFileDescription(record)
                .orElseThrow(() -> new IllegalStateException("Не приложен файл для импорта КПТ id: " + record.getId()));

        File file = fileRepository
                .findById(fileDescription.getId())
                .orElseThrow(() -> new DataServiceException("Не найден файл fileId: " + fileDescription.getId()));

        ImportSourceFileDto fileDto = mapToImportSourceFileDto(file, record);
        if (fileDto.getPath() == null || fileDto.getPath().isBlank()) {
            throw new IllegalStateException("Пустой путь к файлу для импорта КПТ fileId: " + file.getId());
        }

        return fileDto;
    }

    /**
     * Ищет файлы, привязанные к документам КПТ внутри директории
     */
    private List<ImportSourceFileDto> getSourceFilesByDirectory(IRecord directory, SchemaDto kptLibSchema) {
        log.debug("Ищем документы в каталоге: {}", directory);

        String recordsInDir = String.format("%s LIKE '%s/%d'",
                                            PATH.getName(), directory.getAsString(PATH.getName()), directory.getId());

        List<IRecord> records = recordsDao.findAll(libraryQualifier(KPT_LIBRARY_ID),
                                                   recordsInDir,
                                                   kptLibSchema);
        Set<UUID> fileIds = records
                .stream()
                .map(this::extractKptFileDescription)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(FileDescription::getId)
                .collect(Collectors.toSet());

        return fileRepository.findAllByIdIn(fileIds)
                             .stream()
                             .map(file -> mapToImportSourceFileDto(file, findKptRecordByFileId(records, file.getId())))
                             .collect(Collectors.toList());
    }

    private IRecord findKptRecordByFileId(List<IRecord> records, UUID fileId) {
        return records.stream()
                      .filter(record -> {
                          Optional<FileDescription> description = extractKptFileDescription(record);

                          return description.filter(fileDescription -> fileId.equals(fileDescription.getId()))
                                            .isPresent();
                      })
                      .findFirst()
                      .orElseThrow(() -> new IllegalStateException("Не найдена запись с файлом: " + fileId));
    }

    private Optional<FileDescription> extractKptFileDescription(IRecord kptRecord) {
        List<FileDescription> filesDescriptions = (List<FileDescription>) kptRecord.getContent().get(FILE_PROPERTY);
        if (filesDescriptions == null || filesDescriptions.isEmpty()) {
            int id = (int) kptRecord.getContent()
                                    .get(ID.getName());
            log.warn("Невозможно определить файл для импорта кпт с id = {}", id);

            return Optional.empty();
        }

        return Optional.of(filesDescriptions.get(0));
    }

    private ImportSourceFileDto mapToImportSourceFileDto(File file, IRecord record) {
        TypeDocumentData typeDocumentData = new TypeDocumentData();
        typeDocumentData.setId(record.getId());
        typeDocumentData.setTitle(record.getTitle());
        typeDocumentData.setLibraryTableName(KPT_LIBRARY_ID);

        return new ImportSourceFileDto(file.getId(),
                                       file.getPath(),
                                       typeDocumentData);
    }
}
