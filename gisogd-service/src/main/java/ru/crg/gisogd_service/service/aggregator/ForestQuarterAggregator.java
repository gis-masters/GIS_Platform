package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.ForestQuarter;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * ForestQuarter aggregator.
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class ForestQuarterAggregator implements CrimeaAggregator<ForestQuarter> {

    private final EventRepositoryService repositoryService;

    @Override
    public ForestQuarter aggregate(ForestQuarter crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setForestry(repositoryService.findValueByName("forestry", "guid_forestry", event));

        return crimeaObject;
    }
}
