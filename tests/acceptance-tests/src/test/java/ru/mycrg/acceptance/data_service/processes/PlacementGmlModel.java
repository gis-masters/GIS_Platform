package ru.mycrg.acceptance.data_service.processes;

public class PlacementGmlModel {

    private String wsUiId;
    private ImportSource source;
    private ImportTarget target = new ImportTarget();

    public PlacementGmlModel() {
        // Required
    }

    public String getWsUiId() {
        return wsUiId;
    }

    public void setWsUiId(String wsUiId) {
        this.wsUiId = wsUiId;
    }

    public ImportSource getSource() {
        return source;
    }

    public void setSource(ImportSource source) {
        this.source = source;
    }

    public ImportTarget getTarget() {
        return target;
    }

    public void setTarget(ImportTarget target) {
        this.target = target;
    }

    public void setProjectId(long id) {
        this.target.setProjectId(id);
    }
}
