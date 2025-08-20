package ru.mycrg.data_service.service.cqrs.features.requests;

import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.common_contracts.generated.data_service.GeometryValidationResultDto;

import javax.validation.constraints.NotNull;

public class CheckGeometryValidRequest implements IRequest<GeometryValidationResultDto> {

    @NotNull
    private final Feature feature;

    @NotNull
    private final String epsg;

    public CheckGeometryValidRequest(Feature feature, String epsg) {
        this.feature = feature;
        this.epsg = epsg;
    }

    public Feature getFeature() {
        return feature;
    }

    public String getEpsg() {
        return epsg;
    }

    @Override
    public String getType() {
        return CheckGeometryValidRequest.class.getSimpleName();
    }
}
