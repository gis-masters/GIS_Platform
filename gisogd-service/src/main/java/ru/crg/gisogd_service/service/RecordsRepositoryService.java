package ru.crg.gisogd_service.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.apache.camel.Body;
import org.springframework.stereotype.Service;
import ru.crg.gisogd_service.model.crimea.common.FileRef;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Records entity repository Service.
 * @author Vladimir Nomokonov
 */
@Service
@AllArgsConstructor
public class RecordsRepositoryService {

    private final ObjectMapper objectMapper;

    /**
     * Find files reference in records data
     * @param dataContent - map with data
     * @return List file references - {@link FileRef}
     */
    public List<FileRef> findFilesRef(@Body Map<String, Object> dataContent) {
        Map<String, Object> embedded = (Map<String, Object>) dataContent.get("_embedded");
        List<Map<String, Object>> records = (List<Map<String, Object>>) embedded.get("records");
        Map<String, Object> content = (Map<String, Object>) records.get(0).get("content");
        List<Map<String, Object>> filesMap = (List<Map<String, Object>>) content.get("files");
        if (filesMap == null) {
            filesMap = (List<Map<String, Object>>) content.get("file");
        }
        if (filesMap != null) {
            return objectMapper.convertValue(filesMap, new TypeReference<>() {});
        }
        return Collections.emptyList();
    }
}
