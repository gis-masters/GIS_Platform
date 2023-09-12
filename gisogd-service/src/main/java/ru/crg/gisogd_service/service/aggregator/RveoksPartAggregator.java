package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.RVEOKSPart;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * RVEOKSPart aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class RveoksPartAggregator implements CrimeaAggregator<RVEOKSPart> {

    private final EventRepositoryService repositoryService;

    @Override
    public RVEOKSPart aggregate(RVEOKSPart crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setOKS(repositoryService.findValueByName("oks", "oks_plot_guid", event));
        crimeaObject.setRVEOKS(repositoryService.findGuidByRef("dl_data_rveoks_data_connection", event));
        crimeaObject.setOrgName(repositoryService.findGuidByRef("supplier_data_connection", event));
        crimeaObject.setSupplierEmployee(repositoryService.findGuidByRef("supplieremploey_data_connection", event));
        crimeaObject.setCustomer(repositoryService.findGuidByRef("customer_data_connection", event));
        crimeaObject.setLandPlot(repositoryService.findValueByName("landplot", "landplot_plot_guid", event));
        crimeaObject.setTechPlan(repositoryService.findGuidByRef("tech_plan_data_connection", event));
        crimeaObject.setElevatorsNonProd(repositoryService.findGuidByRef("elevators_non_prod_data_connection", event));
        crimeaObject.setEscalatorsNonProd(repositoryService.findGuidByRef("escalators_non_prod_data_connection", event));
        crimeaObject.setWheelchairLiftsNonProd(repositoryService.findGuidByRef("wheelchair_lifts_non_prod_data_connection", event));
        crimeaObject.setEscalators(repositoryService.findGuidByRef("escalators_data_connection", event));
        crimeaObject.setWheelchairLifts(repositoryService.findGuidByRef("wheelchair_lifts_data_connection", event));

        return crimeaObject;
    }
}
