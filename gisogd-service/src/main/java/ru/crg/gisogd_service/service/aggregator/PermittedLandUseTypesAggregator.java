package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.PermittedLandUseTypes;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * PermittedLandUseTypes aggregator.
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class PermittedLandUseTypesAggregator implements CrimeaAggregator<PermittedLandUseTypes> {

    private final EventRepositoryService repositoryService;

    @Override
    public PermittedLandUseTypes aggregate(PermittedLandUseTypes crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setPermittedUseParameters(repositoryService.findAllGuidsByRef("permitted_use_parameters", event));

        return crimeaObject;
    }
}
