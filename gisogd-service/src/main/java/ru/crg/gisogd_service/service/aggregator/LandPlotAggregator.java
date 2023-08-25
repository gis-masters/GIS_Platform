package ru.crg.gisogd_service.service.aggregator;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import ru.crg.gisogd_service.model.rf.LandPlot;
import ru.crg.gisogd_service.service.EventRepositoryService;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;

/**
 * LAndPlot aggregator
 * @author Vladimir Nomokonov
 */
@Component
@AllArgsConstructor
public class LandPlotAggregator implements CrimeaAggregator<LandPlot> {

    private final EventRepositoryService repositoryService;

    @Override
    public LandPlot aggregate(LandPlot crimeaObject, PublishToGisogdRfEvent event) throws JsonProcessingException {
        //Territory берет из объекта
        //Так же и с LandPlot - есть колонка guid в ней храниться guid объекта territory.
        // И есть landplot_plot_guid который хранит guid объекта LandPlot.
        //
        crimeaObject.setEasement(repositoryService.findValueByName("easement", "easement_plot_guid", event));
        crimeaObject.setPermittedLandUseTypes(
                repositoryService.findAllValuesByName("permitted_land_use_types", "permitted_land_use_type", event));

        return crimeaObject;
    }
}
