package ru.crg.gisogd_service.route;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;
import org.springframework.stereotype.Component;
import ru.crg.gisogd_service.client.DataServiceClient;
import ru.crg.gisogd_service.client.GisogdRfClient;
import ru.crg.gisogd_service.model.rf.Document;
import ru.crg.gisogd_service.model.rf.DocumentPagedModel;
import ru.crg.gisogd_service.service.DocumentTypeResolver;
import ru.crg.gisogd_service.service.RecordsRepositoryService;

import java.util.HashSet;
import java.util.Set;

import static org.apache.camel.Exchange.LOOP_INDEX;

/**
 * DocumentsFiles processing routes.
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
@Slf4j
public class DocumentRoute extends RouteBuilder {

    public static final String GET_REQUESTED_DOCUMENTS_ROUTE_ID = "get-requested-documents-route";
    public static final String SEND_DOCUMENT_ROUTE_ID = "send-document-route";
    public static final int MAX_ITEMS = 500;

    private final DataServiceClient dataServiceClient;
    private final DocumentTypeResolver resolver;
    private final RecordsRepositoryService recordsRepositoryService;
    private final GisogdRfClient gisogdRfClient;

    @Override
    public void configure() {
        from("cron:get-requested-documents?schedule=0 0 * * * ?")
                .to("direct:get-requested-documents");

        from("direct:get-requested-documents")
                .id(GET_REQUESTED_DOCUMENTS_ROUTE_ID)
                .setHeader("pageSize", () -> MAX_ITEMS)
                .log(LoggingLevel.INFO, log, GET_REQUESTED_DOCUMENTS_ROUTE_ID, "page size: ${headers.pageSize}")

                .bean(gisogdRfClient, "getRequestedDocuments")
                .log(LoggingLevel.INFO, log, GET_REQUESTED_DOCUMENTS_ROUTE_ID, "total pages: ${body.getTotalPages()}")

                .loop(simple("${body.getTotalPages()}"))
                /**/.process(exchange -> exchange.getIn().setHeader(
                        "page", exchange.getProperty(LOOP_INDEX, Integer.class) + 1))
                /**/.log(LoggingLevel.INFO, log, GET_REQUESTED_DOCUMENTS_ROUTE_ID,
                         "current documents page: ${headers.page}")
                /**/.bean(gisogdRfClient, "getRequestedDocuments")
                /**/.process(exchange -> {
                    Set<Document> documentGuids = exchange.getIn().getHeader("documentGuids", Set.class);
                    if (documentGuids == null) {
                        documentGuids = new HashSet<>();
                        exchange.getIn().setHeader("documentGuids", documentGuids);
                    }
                    DocumentPagedModel container = exchange.getIn().getBody(DocumentPagedModel.class);
                    if (container.getItems() != null) {
                        documentGuids.addAll(container.getItems());
                    }
                })
                .end()

                .log(LoggingLevel.INFO, log, GET_REQUESTED_DOCUMENTS_ROUTE_ID,
                     "document guids: ${headers.documentGuids.size()}")

                .split(header("documentGuids")).parallelProcessing()
                /**/.to("direct:send-document")
                .end()

                .log(LoggingLevel.INFO, log, GET_REQUESTED_DOCUMENTS_ROUTE_ID,
                     "documents were sent");

        from("direct:send-document")
                .id(SEND_DOCUMENT_ROUTE_ID)
                .log(LoggingLevel.DEBUG, log, GET_REQUESTED_DOCUMENTS_ROUTE_ID, "document: ${body}")

                .setHeader("docClass", simple("${body.getPropertyClass()}"))
                .setHeader("docGuid", simple("${body.getGuid()}"))
                .process(exchange -> {
                    Document doc = exchange.getIn().getBody(Document.class);
                    exchange.getIn().setHeader("docLibId", resolver.getDoclibIdByClassName(doc.getPropertyClass()));
                    exchange.getIn().setHeader("filterByGuid", "guid = '" + doc.getGuid() + "'");
                })
                .bean(dataServiceClient, "getDocByLibIdAndGuid")
                .log(LoggingLevel.DEBUG, log, GET_REQUESTED_DOCUMENTS_ROUTE_ID, "crimea document: ${body}")

                .bean(recordsRepositoryService, "findFilesRef")
                .log(LoggingLevel.DEBUG, log, GET_REQUESTED_DOCUMENTS_ROUTE_ID, "fileRefs: ${body}")

                .setBody(simple("${body.get(0)}"))
                .setHeader("fileGuid", simple("${body.getId()}"))
                .log(LoggingLevel.DEBUG, log, GET_REQUESTED_DOCUMENTS_ROUTE_ID, "fileGuid: ${header.fileGuid}")

                .bean(dataServiceClient, "downloadFile")
                .bean(gisogdRfClient, "sendDocument");
    }
}
