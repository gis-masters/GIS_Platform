package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.SupplierEmployee;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * CrimeaSupplierEmployee aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class SupplierEmployeeAggregator implements CrimeaAggregator<SupplierEmployee> {

    private final EventRepositoryService repositoryService;

    @Override
    public SupplierEmployee aggregate(SupplierEmployee crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setSupplier(repositoryService.findGuidByRef("supplier_data_connection", event));

        return crimeaObject;
    }
}
