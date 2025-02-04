package ru.mycrg.gis_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.LayerReferencesDeletionEvent;
import ru.mycrg.geoserver_client.services.feature_types.FeatureTypeService;
import ru.mycrg.geoserver_client.services.layers.VectorLayer;
import ru.mycrg.gis_service.service.layers.LayerService;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

@Service
public class LayerReferencesDeletionEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(LayerReferencesDeletionEventHandler.class);

    private final LayerService layerService;

    public LayerReferencesDeletionEventHandler(LayerService layerService) {
        this.layerService = layerService;
    }

    @Override
    public String getEventType() {
        return LayerReferencesDeletionEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        LayerReferencesDeletionEvent event = (LayerReferencesDeletionEvent) mqEvent;

        try {
            log.debug("Event: '{}' / Try delete layer references: {}", event.getId(), event.getTableName());

            layerService.deleteByTableName(event.getTableName());

            new VectorLayer(event.getAuthToken())
                    .delete(event.getWorkspaceName(), event.getTableName());
            new FeatureTypeService(event.getAuthToken())
                    .delete(event.getWorkspaceName(), event.getDatasetName(), event.getTableName());

            log.debug("Event: '{}'. Successfully deleted layer references: '{}:{}'",
                      event.getId(), event.getWorkspaceName(), event.getTableName());
        } catch (Exception e) {
            log.error("Event: '{}'. Failed remove layer: {} / Cause: {}",
                      event.getId(), event.getTableName(), e.getMessage());
        }
    }
}