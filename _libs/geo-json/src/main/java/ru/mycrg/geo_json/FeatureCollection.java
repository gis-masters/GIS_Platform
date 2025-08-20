package ru.mycrg.geo_json;

import java.util.*;

public class FeatureCollection extends GeoJsonObject implements Iterable<Feature> {

    private List<Feature> features = new ArrayList<>();

    public List<Feature> getFeatures() {
        return features;
    }

    public void setFeatures(List<Feature> features) {
        this.features = features;
    }

    public FeatureCollection add(Feature feature) {
        features.add(feature);
        return this;
    }

    public void addAll(Collection<Feature> features) {
        this.features.addAll(features);
    }

    @Override
    public Iterator<Feature> iterator() {
        return features.iterator();
    }

    @Override
    public <T> T accept(GeoJsonObjectVisitor<T> geoJsonObjectVisitor) {
        return geoJsonObjectVisitor.visit(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (!(o instanceof FeatureCollection)) {
            return false;
        }

        FeatureCollection asCollection = (FeatureCollection) o;

        return features.equals(asCollection.features);
    }

    @Override
    public int hashCode() {
        return features.hashCode();
    }

    @Override
    public String toString() {
        return "{" +
                "\"features\":" + features +
                "}";
    }
}
