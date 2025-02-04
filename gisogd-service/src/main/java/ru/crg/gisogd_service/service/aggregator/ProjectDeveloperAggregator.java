package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.ProjectDeveloper;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * ProjectDeveloper aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class ProjectDeveloperAggregator implements CrimeaAggregator<ProjectDeveloper> {

    private final EventRepositoryService repositoryService;

    @Override
    public ProjectDeveloper aggregate(ProjectDeveloper crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        crimeaObject.setOrganization(repositoryService.findGuidByRef("organization", event));
        crimeaObject.setCitizen(repositoryService.findGuidByRef("citizen", event));

        return crimeaObject;
    }
}
