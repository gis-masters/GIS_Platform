package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.ForestLand;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * ForestLand aggregator.
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class ForestLandAggregator implements CrimeaAggregator<ForestLand> {

    private final EventRepositoryService repositoryService;

    @Override
    public ForestLand aggregate(ForestLand crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setProjectDoc(repositoryService.findGuidByRef("project_doc", event));
        crimeaObject.setForestDevelopDoc(repositoryService.findGuidByRef("forest_develop_doc", event));

        return crimeaObject;
    }
}
