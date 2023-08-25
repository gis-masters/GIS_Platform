package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.ForestLand;
import ru.crg.gisogd_service.model.rf.Forestry;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * Forestry aggregator.
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class ForestryAggregator implements CrimeaAggregator<Forestry> {

    private final EventRepositoryService repositoryService;

    @Override
    public Forestry aggregate(Forestry crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setForestRegulation(repositoryService.findGuidByRef("forest_regulation", event));
        crimeaObject.setPermittedUseType(repositoryService.findAllValuesByName("permitted_land_use_types", "permitted_land_use_type", event));

        return crimeaObject;
    }
}
