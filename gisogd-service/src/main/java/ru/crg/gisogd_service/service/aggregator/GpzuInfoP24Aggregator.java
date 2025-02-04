package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.GPZUInfoP24;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * GPZUInfoP24 aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class GpzuInfoP24Aggregator implements CrimeaAggregator<GPZUInfoP24> {

    private final EventRepositoryService repositoryService;

    @Override
    public GPZUInfoP24 aggregate(GPZUInfoP24 crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setGPZU(repositoryService.findGuidByRef("dl_data_gpzu_data_connection", event));

        return crimeaObject;
    }
}
