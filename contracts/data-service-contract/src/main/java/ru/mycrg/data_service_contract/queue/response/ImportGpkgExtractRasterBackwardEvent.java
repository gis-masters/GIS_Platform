package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTile;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GEO_WRAPPER_TO_INTEGRATION_QUEUE;

//TODO: сдвинуть в пакет package ru.mycrg.messagebus_contract.events.integration_wrapper;
public class ImportGpkgExtractRasterBackwardEvent extends DefaultMessageBusResponseEvent implements Serializable {

    private ProcessStatus status;
    private String businessKey;
    private Map<String, GpkgTile> tiles = new HashMap<>();
    private String message;

    public ImportGpkgExtractRasterBackwardEvent() {
        super();
    }

    public ImportGpkgExtractRasterBackwardEvent(ProcessStatus status,
                                                String businessKey,
                                                Map<String, GpkgTile> tiles) {
        super(GEO_WRAPPER_TO_INTEGRATION_QUEUE);

        this.status = status;
        this.businessKey = businessKey;
        this.tiles = tiles;
    }

    public ImportGpkgExtractRasterBackwardEvent(ProcessStatus status,
                                                String businessKey,
                                                String message) {
        super(GEO_WRAPPER_TO_INTEGRATION_QUEUE);

        this.status = status;
        this.businessKey = businessKey;
        this.message = message;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }

    public Map<String, GpkgTile> getTiles() {
        return tiles;
    }

    public void setTiles(Map<String, GpkgTile> tiles) {
        this.tiles = tiles == null ? new HashMap<>() : tiles;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
