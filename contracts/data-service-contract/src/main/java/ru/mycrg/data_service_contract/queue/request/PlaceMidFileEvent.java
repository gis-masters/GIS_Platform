package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.data_service_contract.dto.ProcessModel;

import java.util.UUID;

public class PlaceMidFileEvent extends PlaceTabFileEvent {

    public PlaceMidFileEvent() {
        super();
    }

    public PlaceMidFileEvent(String token, ProcessModel processModel, UUID wsMsgId, String wsUiId,
                             Long projectId, String libraryId, Long recordId, String layerTitle,
                             String workspaceName, String storeName, String featureName, String pathToFile,
                             String crs, String styleName) {
        super(token, processModel, wsMsgId, wsUiId, projectId, libraryId, recordId, layerTitle, workspaceName,
              storeName, featureName, pathToFile, crs, styleName);
    }
}
