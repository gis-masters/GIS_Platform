package ru.mycrg.data_service.dao;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ConnectionInfo {
    String dbName;
    String schemaName;
    String tableName;
}
