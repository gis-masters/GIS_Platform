package ru.mycrg.common.import_;

import java.util.ArrayList;
import java.util.List;

public class ImportMqRequest {

    private List<ImportFeature> importFeatures = new ArrayList<>();

    public ImportMqRequest() {}

    public List<ImportFeature> getImportFeatures() {
        return importFeatures;
    }

    public void addImportFeature(ImportFeature importFeature) {
        this.importFeatures.add(importFeature);
    }
}
