package ru.crg.gisogd_service.route;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.camel.*;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.spring.junit5.CamelSpringBootTest;
import org.apache.camel.test.spring.junit5.MockEndpoints;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import ru.crg.gisogd_service.client.DataServiceClient;
import ru.crg.gisogd_service.client.GisogdRfClient;
import ru.crg.gisogd_service.model.rf.Document;
import ru.crg.gisogd_service.model.rf.DocumentPagedModel;
import ru.crg.gisogd_service.service.DocumentTypeResolver;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static java.util.Collections.emptyMap;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static ru.crg.gisogd_service.route.DocumentRoute.*;

@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@SpringBootTest(properties = {
        "camel.springboot.auto-startup=false",
        "logging.level.ru.crg.gisogd_service.route.DocumentRoute=DEBUG"
})
@CamelSpringBootTest
@MockEndpoints
class DocumentRouteTest {

    private final CamelContext camelContext;
    private final ObjectMapper objectMapper;

    @Produce
    private ProducerTemplate producerTemplate;
    @EndpointInject("mock:direct:get-document-from-crimea")
    private MockEndpoint mockGetDocumentFromCrimeaEndpoint;

    @MockBean
    private DocumentTypeResolver resolver;
    @MockBean
    private DataServiceClient dataServiceClient;
    @MockBean
    private GisogdRfClient gisogdRfClient;

    @Value("classpath:doclibs/dl_data_section1-guid-doc1.json")
    Resource dlDataSectionDoc;

    private static final String FILE_NAME = "fileName";
    private static final byte[] FILE_CONTENT = "fileContent".getBytes(StandardCharsets.UTF_8);
    private static final MultipartFile MULTIPART_FILE = new MockMultipartFile(FILE_NAME, FILE_CONTENT);

    @BeforeEach
    @SneakyThrows
    void start() {
        when(resolver.getDoclibIdByClassName(any())).thenReturn("docLibId");
        when(dataServiceClient.getDocByLibIdAndGuid(any(), any())).thenReturn(emptyMap());
        when(dataServiceClient.downloadFile(any())).thenReturn(MULTIPART_FILE.getBytes());
        when(dataServiceClient.createLibraryRecord(any())).thenAnswer(invocation -> {
            assertNotNull(invocation.getArgument(0));
            return Map.of("id", 0);
        });
        doAnswer(invocation -> {
            assertNotNull(invocation.getArgument(0));
            assertNotNull(invocation.getArgument(1));
            return null;
        }).when(dataServiceClient).updateLibraryRecord(anyInt(), any());

        doAnswer(invocation -> null).when(gisogdRfClient).sendDocument(any());

        camelContext.getRouteController().startRoute(GET_REQUESTED_DOCUMENTS_ROUTE_ID);
        camelContext.getRouteController().startRoute(GET_DOCUMENT_FROM_CRIMEA_ROUTE_ID);
        camelContext.getRouteController().startRoute(SEND_DOCUMENT_ROUTE_ID);
    }

    @AfterEach
    void end() {
        mockGetDocumentFromCrimeaEndpoint.reset();
    }

    @Test
    @SneakyThrows
    void getDocumentsFromCrimeaAndSendDocumentToRfRouteTest() {
        String guid = UUID.randomUUID().toString();
        String propertyClass = "propertyClass";

        doAnswer(invocation -> {
            assertEquals(propertyClass, invocation.getArguments()[0]);
            assertEquals(guid, invocation.getArguments()[1]);
            assertEquals(MULTIPART_FILE, invocation.getArguments()[2]);
            return null;
        }).when(gisogdRfClient).sendDocument(any());

        when(dataServiceClient.getDocByLibIdAndGuid(any(), any())).thenReturn(
                objectMapper.readValue(dlDataSectionDoc.getInputStream(), Map.class));

        Document document = new Document().guid(guid).propertyClass(propertyClass);
        mockGetDocumentFromCrimeaEndpoint.expectedMessageCount(1);
        assertDoesNotThrow(() -> producerTemplate.sendBodyAndHeader(
                "direct:get-document-from-crimea", document,
                "rootFolderRecId", 0));
        mockGetDocumentFromCrimeaEndpoint.assertIsSatisfied();

        assertEquals(document, mockGetDocumentFromCrimeaEndpoint.getExchanges().get(0).getIn().getBody(Document.class));
    }

    @Test
    @SneakyThrows
    void getDocumentsFromCrimeaAndSendDocumentToRfEmptyFileRefsRouteTest() {
        String guid = UUID.randomUUID().toString();
        String propertyClass = "propertyClass";

        Document document = new Document().guid(guid).propertyClass(propertyClass);
        mockGetDocumentFromCrimeaEndpoint.expectedMessageCount(1);
        assertDoesNotThrow(() -> producerTemplate.sendBodyAndHeader(
                "direct:get-document-from-crimea", document,
                "rootFolderRecId", 0));
        mockGetDocumentFromCrimeaEndpoint.assertIsSatisfied();

        assertEquals(document, mockGetDocumentFromCrimeaEndpoint.getExchanges().get(0).getIn().getBody(Document.class));
    }

    @Test
    @SneakyThrows
    void getRequestedDocumentsRouteTest() {
        int overallCount = MAX_ITEMS + 100;
        when(gisogdRfClient.getRequestedDocuments(any(), any())).thenAnswer(invocation -> {
            assertEquals(MAX_ITEMS, invocation.getArgument(0, Integer.class));

            DocumentPagedModel model = new DocumentPagedModel();
            model.setPageSize(invocation.getArgument(0));
            model.setTotalItems(overallCount);
            model.setTotalPages(2);

            Integer currentPage = invocation.getArgument(1, Integer.class);
            model.setCurrentPage(currentPage != null ? currentPage : 1);
            assertTrue(model.getCurrentPage() <= 2);

            int itemCount = currentPage == null || currentPage == 1 ? MAX_ITEMS : overallCount - MAX_ITEMS;
            int iteration = 0;
            while (iteration++ < itemCount) {
                model.addItemsItem(new Document().guid(UUID.randomUUID().toString()).propertyClass("propertyClass"));
            }
            return model;
        });
        Exchange exchange = producerTemplate.request("direct:get-requested-documents", null);
        Set<Document> documentGuids = exchange.getIn().getHeader("documentGuids", Set.class);
        assertEquals(overallCount, documentGuids.size());
    }

    @Test
    @SneakyThrows
    void getRequestedDocumentsInvalidGisogdResponseRouteTest() {
        when(gisogdRfClient.getRequestedDocuments(any(), any())).thenAnswer(invocation -> {
            DocumentPagedModel model = new DocumentPagedModel();
            model.setPageSize(invocation.getArgument(0));
            model.setTotalItems(MAX_ITEMS);
            model.setTotalPages(0);

            int iteration = 0;
            while (iteration++ < MAX_ITEMS) {
                model.addItemsItem(new Document().guid(UUID.randomUUID().toString()).propertyClass("propertyClass"));
            }
            return model;
        });
        Exchange exchange = producerTemplate.request("direct:get-requested-documents", null);
        Set<Document> documentGuids = exchange.getIn().getHeader("documentGuids", Set.class);
        assertEquals(MAX_ITEMS, documentGuids.size());
    }
}
