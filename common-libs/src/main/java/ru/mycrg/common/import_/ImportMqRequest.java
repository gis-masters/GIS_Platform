package ru.mycrg.common.import_;

import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.enums.ProcessType;

import java.util.ArrayList;
import java.util.List;

public class ImportMqRequest extends BaseMqProcessRequest {

    private List<ImportFeature> importFeatures = new ArrayList<>();

    public ImportMqRequest() {}

    public ImportMqRequest(long id, ProcessType type) {
        super(id, type);
    }

    public List<ImportFeature> getImportFeatures() {
        return importFeatures;
    }

    public void addImportFeature(ImportFeature importFeature) {
        this.importFeatures.add(importFeature);
    }
}
