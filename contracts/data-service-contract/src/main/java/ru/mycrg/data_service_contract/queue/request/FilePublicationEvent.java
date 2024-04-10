package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.data_service_contract.dto.publication.BaseWsProcess;
import ru.mycrg.data_service_contract.dto.publication.GeoserverPublicationData;
import ru.mycrg.data_service_contract.dto.publication.GisPublicationData;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.io.Serializable;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_INTEGRATION_QUEUE;

public class FilePublicationEvent extends DefaultMessageBusRequestEvent implements Serializable {

    private FileType type;
    private BaseWsProcess baseWsProcess;
    private GeoserverPublicationData geoserverPublicationData;
    private GisPublicationData gisPublicationData;

    public FilePublicationEvent() {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);
    }

    public FilePublicationEvent(FileType type,
                                BaseWsProcess baseWsProcess,
                                GeoserverPublicationData geoserverPublicationData,
                                GisPublicationData gisPublicationData) {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);

        this.type = type;
        this.baseWsProcess = baseWsProcess;
        this.geoserverPublicationData = geoserverPublicationData;
        this.gisPublicationData = gisPublicationData;
    }

    public FileType getType() {
        return type;
    }

    public void setType(FileType type) {
        this.type = type;
    }

    public BaseWsProcess getBaseWsProcess() {
        return baseWsProcess;
    }

    public void setBaseWsProcess(BaseWsProcess baseWsProcess) {
        this.baseWsProcess = baseWsProcess;
    }

    public GeoserverPublicationData getGeoserverPublicationData() {
        return geoserverPublicationData;
    }

    public void setGeoserverPublication(GeoserverPublicationData geoserverPublicationData) {
        this.geoserverPublicationData = geoserverPublicationData;
    }

    public GisPublicationData getGisPublicationData() {
        return gisPublicationData;
    }

    public void setGisPublication(GisPublicationData gisPublicationData) {
        this.gisPublicationData = gisPublicationData;
    }

    @Override
    public String toString() {
        return "{" +
                "\"type\":" + (type == null ? "null" : type) + ", " +
                "\"baseWsProcess\":" + (baseWsProcess == null ? "null" : baseWsProcess) + ", " +
                "\"geoserverPublication\":" + (geoserverPublicationData == null ? "null" : geoserverPublicationData) + ", " +
                "\"gisPublication\":" + (gisPublicationData == null ? "null" : gisPublicationData) +
                "}";
    }
}
