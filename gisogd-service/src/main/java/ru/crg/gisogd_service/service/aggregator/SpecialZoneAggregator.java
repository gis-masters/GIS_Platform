package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.Customer;
import ru.crg.gisogd_service.model.rf.SpecialZone;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * SpecialZone aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class SpecialZoneAggregator implements CrimeaAggregator<SpecialZone> {

    private final EventRepositoryService repositoryService;

    @Override
    public SpecialZone aggregate(SpecialZone crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setDocument(repositoryService.findGuidByRef("document", event));

        return crimeaObject;
    }
}
