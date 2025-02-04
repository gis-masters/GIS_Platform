package ru.mycrg.gis_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.BasemapReferencesDeletionEvent;
import ru.mycrg.geoserver_client.services.coverages.Coverages;
import ru.mycrg.geoserver_client.services.layers.VectorLayer;
import ru.mycrg.geoserver_client.services.layers.models.Layer;
import ru.mycrg.geoserver_client.services.storage.raster.RasterStorage;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.service.BasemapService;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

@Service
public class BasemapReferencesDeletionEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(BasemapReferencesDeletionEventHandler.class);

    private final BasemapService basemapService;

    public BasemapReferencesDeletionEventHandler(BasemapService basemapService) {
        this.basemapService = basemapService;
    }

    @Override
    public String getEventType() {
        return BasemapReferencesDeletionEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            BasemapReferencesDeletionEvent event = (BasemapReferencesDeletionEvent) mqEvent;
            log.debug("Event: '{}'. Try delete basemap references: {}", event.getId(), event.getBasemapId());

            basemapService.deleteByBasemapId(event.getBasemapId());

            final String complexLayerName = event.getComplexLayerName();
            if (complexLayerName != null) {
                deleteFromGeoserver(event, complexLayerName);
            } else {
                log.debug("Event: '{}'. Successfully deleted basemap references, nothing delete from geoserver.",
                          event.getId());
            }
        } catch (Exception e) {
            log.error("Event: '{}'. Failed remove layer. Cause: {}",
                      mqEvent.getId(), e.getCause().getMessage());
        }
    }

    private void deleteFromGeoserver(BasemapReferencesDeletionEvent event, String complexLayerName) {
        try {
            final String workspaceName = complexLayerName.split(":")[0];
            final String layerName = complexLayerName.split(":")[1];

            final Layer geoserverLayer = new VectorLayer(event.getAuthToken())
                    .getByName(layerName)
                    .orElseThrow(() -> new NotFoundException("На геосервере не найден слой: " + layerName));

            final String coverageName = getCoverageName(geoserverLayer);
            new VectorLayer(event.getAuthToken())
                    .delete(workspaceName, layerName);

            new Coverages(event.getAuthToken())
                    .delete(workspaceName, coverageName, coverageName);

            new RasterStorage(event.getAuthToken())
                    .delete(workspaceName, coverageName, false);

            log.debug("Event: '{}'. Successfully deleted all basemap references: '{}'",
                      event.getId(), complexLayerName);
        } catch (Exception e) {
            log.error("Event: '{}'. Failed remove layer from geoserver: {} / Cause: {}",
                      event.getId(), event.getBasemapId(), e.getCause().getMessage());
        }
    }

    private String getCoverageName(Layer geoserverLayer) {
        final String complexCoverageName = geoserverLayer.getResource().getName();

        return complexCoverageName.split(":")[1];
    }
}
