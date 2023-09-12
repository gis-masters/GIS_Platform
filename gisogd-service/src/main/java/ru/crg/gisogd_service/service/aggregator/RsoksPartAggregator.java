package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.RSOKSPart;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * RSOKSPart aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class RsoksPartAggregator implements CrimeaAggregator<RSOKSPart> {

    private final EventRepositoryService repositoryService;

    @Override
    public RSOKSPart aggregate(RSOKSPart crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setOKS(repositoryService.findValueByName("oks", "oks_plot_guid", event));
        crimeaObject.setRSOKS(repositoryService.findGuidByRef("dl_data_rsoks_data_connection", event));
        crimeaObject.setOkSPurpose(repositoryService.findValueByName("data_oks_purpose", "code", event));
        crimeaObject.setElevatorsNonProd(repositoryService.findGuidByRef("elevators_non_prod_data_connection", event));
        crimeaObject.setEscalatorsNonProd(repositoryService.findGuidByRef("escalators_non_prod_data_connection", event));
        crimeaObject.setWheelchairLiftsNonProd(repositoryService.findGuidByRef("wheelchair_lifts_non_prod_data_connection", event));
        crimeaObject.setEscalators(repositoryService.findGuidByRef("escalators_data_connection", event));
        crimeaObject.setWheelchairLifts(repositoryService.findGuidByRef("wheelchair_lifts_data_connection", event));

        return crimeaObject;
    }
}
