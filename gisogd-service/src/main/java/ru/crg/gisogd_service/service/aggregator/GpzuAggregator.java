package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.GPZU;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * GPZU aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class GpzuAggregator implements CrimeaAggregator<GPZU> {

    private final EventRepositoryService repositoryService;

    @Override
    public GPZU aggregate(GPZU crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setDataSection13(repositoryService.findGuidByRef("dl_data_section13_data_connection", event));
        crimeaObject.setProjectDeveloper(repositoryService.findGuidByRef("project_developer_data_connection", event));
        crimeaObject.setInfoP221(repositoryService.findAllGuidsByRef("info_p2_2_1", event));
        crimeaObject.setInfoP222(repositoryService.findAllGuidsByRef("info_p2_2_2", event));
        crimeaObject.setInfoP223(repositoryService.findAllGuidsByRef("info_p2_2_3", event));

        return crimeaObject;
    }
}
