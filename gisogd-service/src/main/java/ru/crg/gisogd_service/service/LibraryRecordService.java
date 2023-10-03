package ru.crg.gisogd_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.crg.gisogd_service.client.DataServiceClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Document library service.
 * @author Sergey Valiev
 */
@Service
@AllArgsConstructor
public class LibraryRecordService {
    private final DataServiceClient dataServiceClient;
    private final ObjectMapper objectMapper;

    /**
     * Creates root folder.
     * @return created folder id
     */
    public Integer createRootFolder() throws JsonProcessingException {
        LocalDateTime ts = LocalDateTime.now();
        return createRecord(Map.of(
                "content_type_id", "main_folder",
                "path", "/root",
                "task_start", ts.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                "title", ts.format(DateTimeFormatter.ofPattern("Отправка dd.MM.yyyy в HH:mm"))
        ));
    }

    /**
     * Creates sub folder.
     * @param rootFolderRecId root folder id
     * @param data additional data
     * @return sub folder id
     */
    public Integer createSubFolder(Integer rootFolderRecId, Map<String, Object> data) throws JsonProcessingException {
        Map<String, Object> recordDesc = data != null ? new HashMap<>(data) : new HashMap<>();
        recordDesc.put("task_start", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        recordDesc.put("content_type_id", "current_object_folder");
        recordDesc.put("path", "/root/" + rootFolderRecId);
        return createRecord(recordDesc);
    }

    /**
     * Creates document.
     * @param rootFolderRecId root folder id
     * @param subFolderRecId sub folder id
     * @param data additional data
     * @return document id
     */
    public Integer createDocument(Integer rootFolderRecId, Integer subFolderRecId, Map<String, Object> data) throws JsonProcessingException {
        Map<String, Object> recordDesc = data != null ? new HashMap<>(data) : new HashMap<>();
        recordDesc.put("task_start", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        recordDesc.put("content_type_id", "doc");
        recordDesc.put("path", String.format("/root/%s/%s", rootFolderRecId, subFolderRecId));
        return createRecord(recordDesc);
    }

    /**
     * Updates record by id.
     * @param recId record id
     * @param data specified data
     */
    public void updateRecord(Integer recId, Map<String, Object> data) {
        dataServiceClient.updateLibraryRecord(recId, data);
    }

    /**
     * Creates new record with specified data.
     * @param data data
     * @return record id
     */
    private Integer createRecord(Map<String, Object> data) throws JsonProcessingException {
        Map<String, Object> result = dataServiceClient.createLibraryRecord(Map.of("body", objectMapper.writeValueAsString(data)));
        return (Integer) result.get("id");
    }

    /**
     * Sets end of task timestamp.
     * @param recId record id
     */
    public void commitLibraryRecord(Integer recId) {
        dataServiceClient.updateLibraryRecord(recId, Map.of(
                "task_end", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
        ));
    }
}
