package ru.crg.gisogd_service.route;

import static java.util.stream.Collectors.toMap;

import static org.apache.camel.Exchange.LOOP_INDEX;
import static ru.crg.gisogd_service.route.RfRoute.ERRORS_RESPONSE_STATUS;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.IntStream;

import org.apache.camel.Exchange;
import org.apache.camel.LoggingLevel;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import feign.FeignException;
import feign.form.FormData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ru.crg.gisogd_service.client.DataServiceClient;
import ru.crg.gisogd_service.client.GisogdRfClient;
import ru.crg.gisogd_service.model.crimea.common.FileRef;
import ru.crg.gisogd_service.model.rf.Document;
import ru.crg.gisogd_service.model.rf.DocumentPagedModel;
import ru.crg.gisogd_service.service.BadRequestErrorsResolver;
import ru.crg.gisogd_service.service.DocumentTypeResolver;
import ru.crg.gisogd_service.service.LibraryRecordService;
import ru.mycrg.gisog_service_contract.dto.Status;

/**
 * DocumentsFiles processing routes.
 * @author Vladimir Nomokonov
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DocumentRoute extends RouteBuilder {

    public static final String GET_REQUESTED_DOCUMENTS_ROUTE_ID = "get-requested-documents-route";
    public static final String GET_DOCUMENT_FROM_CRIMEA_ROUTE_ID = "get-document-from-crimea-route";
    public static final String SEND_DOCUMENT_ROUTE_ID = "send-document-route";
    public static final int MAX_ITEMS = 500;

    private final DataServiceClient dataServiceClient;
    private final DocumentTypeResolver resolver;
    private final GisogdRfClient gisogdRfClient;
    private final LibraryRecordService libraryRecordService;
    private final ObjectMapper objectMapper;
    private final BadRequestErrorsResolver errorsResolver;

    @Value("${camel.get-requested-documents.schedule:0 0 * * * ?}")
    private String schedule;

    private final Processor collectDocumentHeader = exchange -> {
        Set<Document> documentGuids = exchange.getIn().getHeader("documentGuids", Set.class);
        if (documentGuids == null) {
            documentGuids = new HashSet<>();
            exchange.getIn().setHeader("documentGuids", documentGuids);
        }
        DocumentPagedModel container = exchange.getIn().getBody(DocumentPagedModel.class);
        if (container.getItems() != null && !container.getItems().isEmpty()) {
            documentGuids.addAll(container.getItems());
        }
    };

    @Override
    public void configure() {
        log.info("active schedule: {}", schedule);
        from("cron:get-requested-documents?schedule=" + schedule)
                .to("direct:get-requested-documents");

        from("direct:get-requested-documents")
                .id(GET_REQUESTED_DOCUMENTS_ROUTE_ID)

                .process(exchange -> exchange.getIn().setHeader(
                        "rootFolderRecId",
                        libraryRecordService.createRootFolder()
                ))

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
                /**/.process(collectDocumentHeader)
                .end()

                //TODO убрать в будущем. Обход ошибки в ГИСОГД РФ
                //Условие если TotalPage=0 и TotalItems > 0, то пробежим по списку Items соберем GUID
                .process(exchange -> {
                    DocumentPagedModel container = exchange.getIn().getBody(DocumentPagedModel.class);
                    if (container.getTotalPages() == 0
                        && container.getItems() != null
                        && !container.getItems().isEmpty()) {
                        collectDocumentHeader.process(exchange);
                    }
                })

                .log(LoggingLevel.INFO, log, GET_REQUESTED_DOCUMENTS_ROUTE_ID,
                     "document guids: ${headers.documentGuids.size()}")

                .process(exchange -> libraryRecordService.updateRecord(
                        exchange.getIn().getHeader("rootFolderRecId", Integer.class),
                        Map.of("get_documents_list",
                               Optional.ofNullable(exchange.getIn().getHeader("documentGuids", String.class))
                                       .orElse(StringUtils.EMPTY))
                ))

                .split(header("documentGuids")).parallelProcessing()
                /**/.to("direct:get-document-from-crimea")
                .end()

                .process(exchange -> libraryRecordService.commitLibraryRecord(
                        exchange.getIn().getHeader("rootFolderRecId", Integer.class)
                ))

                .log(LoggingLevel.INFO, log, GET_REQUESTED_DOCUMENTS_ROUTE_ID,
                     "route '" + GET_REQUESTED_DOCUMENTS_ROUTE_ID + "' has been executed");

        from("direct:get-document-from-crimea")
                .id(GET_DOCUMENT_FROM_CRIMEA_ROUTE_ID)
                .log(LoggingLevel.DEBUG, log, GET_DOCUMENT_FROM_CRIMEA_ROUTE_ID, "document: ${body}")

                .setHeader("docClass", simple("${body.getPropertyClass()}"))
                .setHeader("docGuid", simple("${body.getGuid()}"))

                .process(exchange -> exchange.getIn().setHeader(
                        "subFolderRecId",
                        libraryRecordService.createSubFolder(
                                exchange.getIn().getHeader("rootFolderRecId", Integer.class),
                                Map.of("guid", exchange.getIn().getHeader("docGuid", String.class)))
                ))

                .process(exchange -> {
                    Document doc = exchange.getIn().getBody(Document.class);
                    exchange.getIn().setHeader("docLibId", resolver.getDoclibIdByClassName(doc.getPropertyClass()));
                    exchange.getIn().setHeader("filterByGuid", "guid = '" + doc.getGuid() + "'");
                })

                .bean(dataServiceClient, "getDocByLibIdAndGuid")
                .log(LoggingLevel.DEBUG, log, GET_DOCUMENT_FROM_CRIMEA_ROUTE_ID, "crimea document: ${body}")

                .setBody(exchange -> {
                    Map<String, Object> body = exchange.getIn().getBody(Map.class);
                    Map<String, Object> embedded = (Map<String, Object>) body.get("_embedded");
                    if (embedded == null) {
                        return null;
                    }

                    List<Map<String, Object>> records = (List<Map<String, Object>>) embedded.get("records");
                    Map<String, Object> content = (Map<String, Object>) records.get(0).get("content");

                    exchange.getIn().setHeader("objectId", content.get("id"));
                    exchange.getIn().setHeader("docGuid", content.get("guid"));
                    exchange.getIn().setHeader("subFolderTitle", content.get("title"));

                    List<Map<String, Object>> filesMap = (List<Map<String, Object>>) content.get("files");
                    if (filesMap == null) {
                        filesMap = (List<Map<String, Object>>) content.get("file");
                    }
                    List<FileRef> result = null;
                    if (filesMap != null) {
                        result = objectMapper.convertValue(filesMap, new TypeReference<>() {

                        });
                        result = result.isEmpty() ? null : result;
                    }
                    return result;
                })

                .process(exchange -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("title", exchange.getIn().getBody() == null
                                      ? "Документ библиотеки не найден"
                                      : exchange.getIn().getHeader("subFolderTitle", String.class));
                    data.put("library_name", exchange.getIn().getHeader("docLibId", String.class));
                    data.put("guid", exchange.getIn().getHeader("docGuid", String.class));
                    data.put("object_id", exchange.getIn().getHeader("objectId", Integer.class));

                    libraryRecordService.updateRecord(
                            exchange.getIn().getHeader("subFolderRecId", Integer.class),
                            data);
                })

                .choice()
                /**/.when(body().isNull())
                /**//**/.log(LoggingLevel.DEBUG, log, GET_DOCUMENT_FROM_CRIMEA_ROUTE_ID, "nothing to send")
                /**/.endChoice()

                /**/.otherwise()
                /**//**/.log(LoggingLevel.DEBUG, log, GET_DOCUMENT_FROM_CRIMEA_ROUTE_ID, "fileRefs: ${body}")

                /**//**/.split(body())
                /**//**//**/.to("direct:send-document")
                /**//**/.end()
                /**/.endChoice()
                .end()

                .process(exchange -> libraryRecordService.commitLibraryRecord(
                        exchange.getIn().getHeader("subFolderRecId", Integer.class)
                ));

        from("direct:send-document")
                .id(SEND_DOCUMENT_ROUTE_ID)

                .process(exchange -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("title", exchange.getIn().getBody(FileRef.class).getTitle());
                    data.put("file_id", exchange.getIn().getBody(FileRef.class).getId());
                    data.put("library_name", exchange.getIn().getHeader("docLibId", String.class));
                    data.put("object_id", exchange.getIn().getHeader("objectId", Integer.class));

                    exchange.getIn().setHeader(
                            "documentRecId",
                            libraryRecordService.createDocument(
                                    exchange.getIn().getHeader("rootFolderRecId", Integer.class),
                                    exchange.getIn().getHeader("subFolderRecId", Integer.class),
                                    data));
                })

                .setHeader("fileGuid", simple("${body.getId()}"))
                .setHeader("fileName", simple("${body.getTitle()}"))
                .log(LoggingLevel.DEBUG, log, GET_DOCUMENT_FROM_CRIMEA_ROUTE_ID, "fileGuid: ${header.fileGuid}")

                .doTry()
                /**/.bean(dataServiceClient, "downloadFile")
                .doCatch(Exception.class)
                /**/.process(exchange -> {
                    Throwable exception = exchange.getProperty(Exchange.EXCEPTION_CAUGHT, Throwable.class);
                    libraryRecordService.updateRecord(
                            exchange.getIn().getHeader("documentRecId", Integer.class),
                            Map.of("title",
                                   exception instanceof FeignException.NotFound
                                   ? "Нет файла для отправки" : "Файл недоступен",
                                   "gisogdrf_sync_status",
                                   exception instanceof FeignException.NotFound
                                   ? Status.NOT_FOUND : Status.GISOGD_FAILED));
                    exchange.getIn().setBody(null);
                })
                /**/.log(LoggingLevel.ERROR, log, SEND_DOCUMENT_ROUTE_ID,
                         "message: ${exception.message}\nstacktrace: ${exception.stacktrace}")
                /**/.stop()
                .end()

                .doTry()
                /**/.setBody(
                        exchange -> {
                            String fileName = exchange.getIn().getHeader("fileName", String.class);
                            return new FormData("application/octet-stream", fileName, (byte[]) exchange.getIn().getBody());
                        }
                )
                /**/.bean(gisogdRfClient, "sendDocument")
                /**/.process(exchange -> libraryRecordService.updateRecord(
                        exchange.getIn().getHeader("documentRecId", Integer.class),
                        Map.of("gisogdrf_sync_status", Status.SUCCESS)))
                .doCatch(Exception.class)
                /**/.process(exchange -> {
                    Throwable exception = exchange.getProperty(Exchange.EXCEPTION_CAUGHT, Throwable.class);
                    String message = exception.getMessage();
                    if (exception instanceof FeignException) {
                        message = errorsResolver.getFeignExceptionMessage((FeignException) exception);
                        if (message != null && message.contains("ArrayOfString")) {
                            List<String> data = new XmlMapper().readValue(message, List.class);
                            Map<String, String> content = IntStream.range(0, data.size())
                                                                   .boxed()
                                                                   .collect(toMap(i -> "parent" + i, data::get));
                            message = objectMapper.writeValueAsString(content);
                        }
                    }
                    libraryRecordService.updateRecord(
                            exchange.getIn().getHeader("documentRecId", Integer.class),
                            Map.of("gisogdrf_response", message,
                                   "gisogdrf_sync_status", Optional.ofNullable(ERRORS_RESPONSE_STATUS.get(exception.getClass()))
                                                                   .orElse(Status.GISOGD_FAILED)
                            ));
                })
                .end()

                .process(exchange -> libraryRecordService.commitLibraryRecord(
                        exchange.getIn().getHeader("documentRecId", Integer.class)));
    }
}
