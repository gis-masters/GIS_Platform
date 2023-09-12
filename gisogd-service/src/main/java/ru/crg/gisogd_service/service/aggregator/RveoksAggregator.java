package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.RVEOKS;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * RVEOKS aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class RveoksAggregator implements CrimeaAggregator<RVEOKS> {

    private final EventRepositoryService repositoryService;

    @Override
    public RVEOKS aggregate(RVEOKS crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setDataSection13(repositoryService.findGuidByRef("dl_data_section13_data_connection", event));
        crimeaObject.setRSOKS(repositoryService.findGuidByRef("dl_data_rsoks_data_connection", event));
        crimeaObject.setTechPlan(repositoryService.findAllGuidsByRef("dl_data_tech_plan_data_connection", event));

        return crimeaObject;
    }
}
