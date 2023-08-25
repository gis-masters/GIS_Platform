package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.Supplier;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * CrimeaSupplier aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class SupplierAggregator implements CrimeaAggregator<Supplier> {

    private final EventRepositoryService repositoryService;

    @Override
    public Supplier aggregate(Supplier crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setOrganization(repositoryService.findGuidByRef("organization_data_connection", event));

        return crimeaObject;
    }

}
