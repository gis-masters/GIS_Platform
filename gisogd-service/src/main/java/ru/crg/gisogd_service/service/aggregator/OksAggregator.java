package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.OKS;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * Oks aggregator.
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class OksAggregator implements CrimeaAggregator<OKS> {

    private final EventRepositoryService repositoryService;

    @Override
    public OKS aggregate(OKS crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setOkNOrganization(repositoryService.findGuidByRef("okn_organization", event));
        crimeaObject.setPurpose(repositoryService.findValueByName("data_oks_purpose", "code", event));
        crimeaObject.setPermittedLandUseTypes(
                repositoryService.findAllValuesByName("permitted_land_use_types", "permitted_land_use_type", event));

        return crimeaObject;
    }
}
