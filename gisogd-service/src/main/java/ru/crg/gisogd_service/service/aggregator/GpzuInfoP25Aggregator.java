package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.GPZUInfoP25;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * GPZUInfoP25 aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class GpzuInfoP25Aggregator implements CrimeaAggregator<GPZUInfoP25> {

    private final EventRepositoryService repositoryService;

    @Override
    public GPZUInfoP25 aggregate(GPZUInfoP25 crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setGPZU(repositoryService.findGuidByRef("dl_data_gpzu_data_connection", event));

        return crimeaObject;
    }
}
