//package ru.mycrg.gis.service.import_;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import ru.mycrg.common.BaseMqProcessResponse;
//import ru.mycrg.common.import_.ImportMqResponse;
//import ru.mycrg.common.enums.ProcessStatus;
//import ru.mycrg.gis.service.CrgProcess;
//
//import java.time.LocalDateTime;
//import java.util.*;
//import java.util.concurrent.CompletableFuture;
//
//public class ImportProcess extends CrgProcess {
//
//    private static Logger log = LoggerFactory.getLogger(ImportProcess.class);
//
//    private WorkImport request;
//    private List<ImportMqResponse> mqResponses = new ArrayList<>();
//    private CompletableFuture<Map<String, String>> futureResponse = new CompletableFuture<>();
//
//    public ImportProcess(WorkImport workImport) {
//        super();
//
//        this.request = workImport;
//    }
//
//    @Override
//    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
//        ImportMqResponse response = (ImportMqResponse) mqResponse;
//
//        mqResponses.add(response);
//
//        if (request.getImportTasks().size() == mqResponses.size()) {
//            setEndTime(LocalDateTime.now());
//
//            log.info("Process id: {} is DONE. Processed: {}", getId(), mqResponses.size());
//            futureResponse.complete(prepareResponse());
//        } else {
//            log.info("Process id: {} is PENDING. Processed: {}", getId(), mqResponses.size());
//        }
//    }
//
//    private Map<String, String> prepareResponse() {
//        Map<String, String> response = new HashMap<>();
//
//        mqResponses.forEach(mqResponse -> {
//            String layerName = mqResponse.getLayerName();
//            ProcessStatus status = mqResponse.getStatus();
//
//            if (layerName != null && status != null) {
//                response.put(layerName, status.toString());
//            } else {
//                log.warn("Incorrect response");
//            }
//        });
//
//        return response;
//    }
//
//    public WorkImport getRequest() {
//        return request;
//    }
//
//    public void setRequest(WorkImport request) {
//        this.request = request;
//    }
//
//    public CompletableFuture<Map<String, String>> getFutureResponse() {
//        return futureResponse;
//    }
//}
