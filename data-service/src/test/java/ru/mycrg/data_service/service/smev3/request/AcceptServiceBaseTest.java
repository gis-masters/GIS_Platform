package ru.mycrg.data_service.service.smev3.request;

import com.fasterxml.jackson.core.type.TypeReference;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.enums.TaskStatus;
import ru.mycrg.data_service.util.JsonConverter;

import static org.mockito.ArgumentMatchers.eq;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AcceptServiceBaseTest {

    private static final String TEST_TABLE_NAME = "test_table";
    private static final String TEST_FILE_NAME = "test.pdf";
    private static final Long TEST_FILE_SIZE = 1024L;
    private static final UUID TEST_FILE_UUID = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");

    private static final String DATA_CONNECTION_KEY = "[{\"id\":1,\"libraryTableName\":\"test_table\"}]";
    private static final String TEST_FILE_JSON = "[{\"id\":\"550e8400-e29b-41d4-a716-446655440000\",\"name\":\"test.pdf\",\"size\":1024}]";

    private static final String INBOX_DATA_KEY = "inbox_data_key_data_connection";
    private static final String DATA_SECTION_KEY = "data_section_key_data_connection";

    // Mocked dependencies
    @Mock
    private RecordsDao recordsDao;
    @Mock
    private DocumentLibraryRepository libraryRepository;
    @Mock
    private FileRepository fileRepository;
    @Mock
    private IRecord mockRecord;

    @InjectMocks
    private AcceptServiceBaseImpl acceptService;
    private Map<String, Object> task;
    private TypeDocumentData defaultDocumentData;

    @BeforeEach
    void setUp() {
        task = new HashMap<>();
        defaultDocumentData = createDefaultDocumentData();
        setupDefaultMocks();
        setupDefaultTask();
    }

    @Test
    void shouldThrowExceptionWhenNoDocumentsAttached() {
        assertThrowsWithMessage(
                "Блок data_key_data_connection у задачи не заполнен",
                () -> acceptService.updateTablesAndSendStatusMessageToSmev(task, TaskStatus.DONE, 1L)
        );
    }

    @Test
    void shouldThrowExceptionWhenFileAttributeIsEmpty() {
        setupTaskWithDataSection();
        setupRecordMockWithEmptyFile();

        assertThrowsWithMessage(
                "Поле File у связанного документа не заполнено",
                () -> acceptService.updateTablesAndSendStatusMessageToSmev(task, TaskStatus.DONE, 1L)
        );
    }

    @Test
    void shouldThrowExceptionWhenFileNotSigned() {
        setupTaskWithDataSection();
        setupRecordMockWithFile();
        setupFileRepositoryMock();

        try (MockedStatic<JsonConverter> jsonConverterMock = setupJsonConverterMock()) {
            setupFileJsonConverterMock(jsonConverterMock);

            assertThrowsWithMessage(
                    String.format("Файл не подписан, id: %s", TEST_FILE_UUID),
                    () -> acceptService.updateTablesAndSendStatusMessageToSmev(task, TaskStatus.DONE, 1L)
            );
        }
    }

    // Setup Methods
    private void setupDefaultMocks() {
        when(libraryRepository.findByTableName(anyString()))
                .thenReturn(Optional.of(new DocumentLibrary()));
        when(recordsDao.findById(any(), any()))
                .thenReturn(Optional.of(mockRecord));
    }

    private void setupDefaultTask() {
        task.put(INBOX_DATA_KEY, DATA_CONNECTION_KEY);
    }

    private void setupTaskWithDataSection() {
        task.put(DATA_SECTION_KEY, DATA_CONNECTION_KEY);
    }

    private void setupRecordMockWithEmptyFile() {
        IRecord dataSectionRecord = Mockito.mock(IRecord.class);
        when(dataSectionRecord.getAsString("file")).thenReturn(null);
        when(recordsDao.findById(any(), any()))
                .thenReturn(Optional.of(mockRecord))
                .thenReturn(Optional.of(dataSectionRecord));
    }

    private void setupRecordMockWithFile() {
        IRecord dataSectionRecord = Mockito.mock(IRecord.class);
        when(dataSectionRecord.getAsString("file")).thenReturn(TEST_FILE_JSON);
        when(recordsDao.findById(any(), any())).thenReturn(Optional.of(dataSectionRecord));
    }

    private void setupFileRepositoryMock() {
        when(fileRepository.findAllByIdIn(any())).thenReturn(Collections.singletonList(createTestFile()));
    }

    // Mock Data Creation Methods
    private TypeDocumentData createDefaultDocumentData() {
        TypeDocumentData documentData = new TypeDocumentData();
        documentData.setId(1L);
        documentData.setLibraryTableName(TEST_TABLE_NAME);

        return documentData;
    }

    private File createTestFile() {
        File file = new File();
        file.setId(TEST_FILE_UUID);
        file.setTitle(TEST_FILE_NAME);
        file.setSize(TEST_FILE_SIZE);
        file.setEcp(null);

        return file;
    }

    // JsonConverter Mock Methods
    private MockedStatic<JsonConverter> setupJsonConverterMock() {
        MockedStatic<JsonConverter> jsonConverterMock = Mockito.mockStatic(JsonConverter.class);
        jsonConverterMock.when(() -> JsonConverter.fromJson(
                        anyString(),
                        any(TypeReference.class)))
                .thenReturn(Optional.of(Collections.singletonList(defaultDocumentData)));

        return jsonConverterMock;
    }

    private void setupFileJsonConverterMock(MockedStatic<JsonConverter> jsonConverterMock) {
        jsonConverterMock.when(() -> JsonConverter.fromJson(
                        eq(TEST_FILE_JSON),
                        any(TypeReference.class)))
                .thenAnswer(invocation -> {
                    TypeReference<?> typeRef = invocation.getArgument(1);
                    if (typeRef.getType().toString().contains("FileDescription")) {
                        return Optional.of(Collections.singletonList(
                                new FileDescription(TEST_FILE_UUID, TEST_FILE_NAME, TEST_FILE_SIZE)
                        ));
                    }

                    return Optional.empty();
                });
    }

    // Assertion Helpers
    private void assertThrowsWithMessage(String expectedMessage, Runnable executable) {
        BadRequestException exception = assertThrows(BadRequestException.class, executable::run);
        assertEquals(expectedMessage, exception.getMessage());
    }
}
