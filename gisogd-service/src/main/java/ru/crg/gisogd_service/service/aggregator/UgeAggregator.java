package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.UGE;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * GPZUInfoP41 aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class UgeAggregator implements CrimeaAggregator<UGE> {

    private final EventRepositoryService repositoryService;

    @Override
    public UGE aggregate(UGE crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setDataSection13(repositoryService.findGuidByRef("dl_data_section13_data_connection", event));
        crimeaObject.setWorkType(repositoryService.findGuidByRef("dl_data_work_type_data_connection", event));
        crimeaObject.setProjectDeveloper(repositoryService.findGuidByRef("dl_data_project_developer_data_connection", event));

        return crimeaObject;
    }
}
