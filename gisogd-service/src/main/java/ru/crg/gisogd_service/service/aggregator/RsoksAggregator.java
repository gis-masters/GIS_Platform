package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.RSOKS;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * RSOKS aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class RsoksAggregator implements CrimeaAggregator<RSOKS> {

    private final EventRepositoryService repositoryService;

    @Override
    public RSOKS aggregate(RSOKS crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setDataSection13(repositoryService.findGuidByRef("dl_data_section13_data_connection", event));
        crimeaObject.setExpertise(repositoryService.findGuidByRef("dl_data_uge_data_connection", event));
        crimeaObject.setGPZU(repositoryService.findAllGuidsByRef("dl_data_gpzu_data_connection", event));
        crimeaObject.setSRZU(repositoryService.findGuidByRef("dl_data_srzu_data_connection", event));
        crimeaObject.setPPM(repositoryService.findGuidByRef("dl_data_ppm_data_connection", event));
        crimeaObject.setPPT(repositoryService.findGuidByRef("dl_data_ppt_data_connection", event));
        crimeaObject.setProjectDeveloper(repositoryService.findGuidByRef("dl_data_project_developer_data_connection", event));
        crimeaObject.setProjectDoc(repositoryService.findGuidByRef("dl_data_project_doc_data_connection", event));
        crimeaObject.setTAR(repositoryService.findGuidByRef("dl_data_tar_data_connection", event));
        crimeaObject.setGECE(repositoryService.findGuidByRef("dl_data_gece_data_connection", event));
        crimeaObject.setPS3849(repositoryService.findGuidByRef("dl_data_ps3_8_49_data_connection", event));
        crimeaObject.setPS3949(repositoryService.findGuidByRef("dl_data_ps3_9_49_data_connection", event));

        return crimeaObject;
    }
}
