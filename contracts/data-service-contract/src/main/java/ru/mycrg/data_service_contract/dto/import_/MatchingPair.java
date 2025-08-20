package ru.mycrg.data_service_contract.dto.import_;

public class MatchingPair {

    private SourceAttribute source;
    private TargetAttribute target;

    public MatchingPair() {}

    public MatchingPair(SourceAttribute source, TargetAttribute target) {
        this.source = source;
        this.target = target;
    }

    public SourceAttribute getSource() {
        return source;
    }

    public void setSource(SourceAttribute source) {
        this.source = source;
    }

    public TargetAttribute getTarget() {
        return target;
    }

    public void setTarget(TargetAttribute target) {
        this.target = target;
    }
}
