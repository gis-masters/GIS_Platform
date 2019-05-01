package ru.mycrg.common.import_;

import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.enums.RequestType;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ImportMqRequest extends BaseMqProcessRequest {

    private List<ImportFeature> importFeatures = new ArrayList<>();

    public ImportMqRequest() {}

    public ImportMqRequest(UUID id, RequestType type) {
        super(id, type);
    }

    public List<ImportFeature> getImportFeatures() {
        return importFeatures;
    }

    public void addImportFeature(ImportFeature importFeature) {
        this.importFeatures.add(importFeature);
    }
}
