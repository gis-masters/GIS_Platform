package ru.mycrg.data_service_contract.dto;

import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTile;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.gpkg.BuildGpkgRastersEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GEO_WRAPPER_TO_INTEGRATION_QUEUE;

public class BuildGpkgRastersBackwardEvent extends DefaultMessageBusResponseEvent implements Serializable {

    private BuildGpkgRastersEvent event;
    private ProcessStatus status;
    private List<GpkgTile> report = new ArrayList<>();
    private String message;

    public BuildGpkgRastersBackwardEvent() {
        super();
    }

    public BuildGpkgRastersBackwardEvent(BuildGpkgRastersEvent event,
                                         ProcessStatus status,
                                         String message) {
        super(GEO_WRAPPER_TO_INTEGRATION_QUEUE);

        this.event = event;
        this.status = status;
        this.message = message;
    }

    public BuildGpkgRastersBackwardEvent(BuildGpkgRastersEvent event,
                                         ProcessStatus status,
                                         List<GpkgTile> report) {
        super(GEO_WRAPPER_TO_INTEGRATION_QUEUE);

        this.event = event;
        this.status = status;
        this.report = report;
    }

    public BuildGpkgRastersEvent getEvent() {
        return event;
    }

    public void setEvent(BuildGpkgRastersEvent event) {
        this.event = event;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus processStatus) {
        this.status = processStatus;
    }

    public List<GpkgTile> getReport() {
        return report;
    }

    public void setReport(List<GpkgTile> report) {
        this.report = report;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "{" +
                "\"event\":" + (event == null ? "null" : event) + ", " +
                "\"processStatus\":" + (status == null ? "null" : status) + ", " +
                "\"report\":" + (report == null ? "null" : Arrays.toString(report.toArray())) + ", " +
                "\"message\":" + (message == null ? "null" : "\"" + message + "\"") +
                "}";
    }
}
