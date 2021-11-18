package ru.mycrg.data_service.service.records;

import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;

public class RecordUtil {

    private RecordUtil() {
        throw new IllegalStateException("Utility class");
    }

    public static Map<String, Object> clearSystemAttributes(Map<String, Object> patchedRecord) {
        Map<String, Object> result = new HashMap<>();
        patchedRecord.forEach((key, value) -> {
            if (!key.equals(ID.getName()) &&
                    !key.equals(PATH.getName()) &&
                    !key.equals(CREATED_AT.getName()) &&
                    !key.equals(LAST_MODIFIED.getName()) &&
                    !key.equals("is_folder")) {
                result.put(key, value);
            }
        });

        return result;
    }

    public static Set<String> extractFolderIdsFromPath(String path) {
        final String[] splited = path.split("/root/");
        if (splited.length < 2) {
            return new HashSet<>();
        }

        return Arrays.stream(splited[1].split("/"))
                     .collect(Collectors.toSet());
    }
}
