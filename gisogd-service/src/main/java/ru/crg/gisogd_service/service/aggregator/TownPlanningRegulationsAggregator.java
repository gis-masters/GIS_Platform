package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.TownPlanningRegulations;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * TownPlanningRegulations aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class TownPlanningRegulationsAggregator implements CrimeaAggregator<TownPlanningRegulations> {

    private final EventRepositoryService repositoryService;

    @Override
    public TownPlanningRegulations aggregate(TownPlanningRegulations crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setPermittedLandUseTypes(repositoryService.findAllGuidsByRef("permitted_land_use_types", event));
        crimeaObject.setPermittedUseParameters(repositoryService.findAllGuidsByRef("permitted_use_parameters", event));
        crimeaObject.setPlanningIndicators(repositoryService.findAllGuidsByRef("planning_indicators", event));
        crimeaObject.setTerZone(repositoryService.findAllGuidsByRef("terzone", event));

        return crimeaObject;
    }
}
