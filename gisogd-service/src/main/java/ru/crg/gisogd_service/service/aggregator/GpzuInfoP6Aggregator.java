package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.GPZUInfoP6;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * GPZUInfoP41 aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class GpzuInfoP6Aggregator implements CrimeaAggregator<GPZUInfoP6> {

    private final EventRepositoryService repositoryService;

    @Override
    public GPZUInfoP6 aggregate(GPZUInfoP6 crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setGPZU(repositoryService.findGuidByRef("dl_data_gpzu_data_connection", event));
        crimeaObject.setBorder(repositoryService.findValueByName("territorykey", "shape", event));

        return crimeaObject;
    }
}
