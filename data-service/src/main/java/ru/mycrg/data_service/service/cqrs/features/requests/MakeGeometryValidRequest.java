package ru.mycrg.data_service.service.cqrs.features.requests;

import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequest;

import javax.validation.constraints.NotNull;

public class MakeGeometryValidRequest implements IRequest<Feature> {

    @NotNull
    private final Feature feature;

    public MakeGeometryValidRequest(Feature feature) {
        this.feature = feature;
    }

    public Feature getFeature() {
        return feature;
    }

    @Override
    public String getType() {
        return MakeGeometryValidRequest.class.getSimpleName();
    }
}
