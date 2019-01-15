package ru.mycrg.gis.service;

import ru.mycrg.gis.dto.ColumnProjection;

public class GeoMapping {

    private LayerInfo source;
    private ColumnProjection target;

    public GeoMapping() {}

    public GeoMapping(LayerInfo source, ColumnProjection target) {
        this.source = source;
        this.target = target;
    }

    public LayerInfo getSource() {
        return source;
    }

    public void setSource(LayerInfo source) {
        this.source = source;
    }

    public ColumnProjection getTarget() {
        return target;
    }

    public void setTarget(ColumnProjection target) {
        this.target = target;
    }
}
