package ru.mycrg.data_service.mappers;

import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.SchemasAndTables;

import java.time.LocalDateTime;
import java.util.Map;

public class SchemasAndTablesMapper {

    public static SchemasAndTables mapToEntity(IRecord record) {
        SchemasAndTables entity = new SchemasAndTables();
        Map<String, Object> content = record.getContent();

        if (content.containsKey("id")) {
            entity.setId(record.getId());
        }
        if (content.containsKey("title")) {
            entity.setTitle(record.getTitle());
        }
        if (content.containsKey("details")) {
            entity.setDetails(record.getAsString("details"));
        }
        if (content.containsKey("is_folder")) {
            entity.setFolder(record.isFolder());
        }
        if (content.containsKey("identifier")) {
            entity.setIdentifier(record.getAsString("identifier"));
        }
        if (content.containsKey("path")) {
            entity.setPath(record.getAsString("path"));
        }
        if (content.containsKey("crs")) {
            entity.setCrs(record.getAsString("crs"));
        }
        if (content.containsKey("schema_id")) {
            entity.setSchemaId(record.getAsString("schemaId"));
        }
        if (content.containsKey("items_count")) {
            String asString = record.getAsString("items_count");
            entity.setItemsCount(asString == null ? 0 : Integer.parseInt(asString));
        }
        if (content.containsKey("created_at")) {
            entity.setCreatedAt(asLocalDateTime(content.get("created_at")));
        }
        if (content.containsKey("last_modified")) {
            entity.setLastModified(asLocalDateTime(content.get("last_modified")));
        }
        if (content.containsKey("fias__oktmo")) {
            entity.setFiasOktmo(record.getAsString("fias__oktmo"));
        }
        if (content.containsKey("document_type")) {
            entity.setDocumentType(record.getAsString("document_type"));
        }
        if (content.containsKey("doc_approve_date")) {
            entity.setDocApproveDate(asLocalDateTime(content.get("doc_approve_date")));
        }
        if (content.containsKey("scale")) {
            String asString = record.getAsString("scale");
            entity.setScale(asString == null ? 0 : Integer.parseInt(asString));
        }
        if (content.containsKey("status")) {
            entity.setStatus(record.getAsString("status"));
        }
        if (content.containsKey("is_public")) {
            entity.setIsPublic(record.asBoolean("is_public"));
        }
        if (content.containsKey("ready_for_fts")) {
            entity.setReadyForFts(record.asBoolean("ready_for_fts"));
        }
        if (content.containsKey("doc_termination_date")) {
            entity.setDocTerminationDate(asLocalDateTime(content.get("doc_termination_date")));
        }
        if (content.containsKey("fias__address")) {
            entity.setFiasAdress(record.getAsString("fias__address"));
        }
        if (content.containsKey("fias__id")) {
            String asString = record.getAsString("fias__id");
            entity.setFiasId(asString == null ? 0 : Long.parseLong(asString));
        }
        if (content.containsKey("gisogd_rf_publication_order")) {
            String asString = record.getAsString("gisogd_rf_publication_order");
            entity.setGisogdRfPublicationOrder(asString == null ? 0 : Integer.parseInt(asString));
        }

        return entity;
    }

    private static LocalDateTime asLocalDateTime(Object o) {
        if (o instanceof LocalDateTime) {
            return (LocalDateTime) o;
        } else if (o instanceof String) {
            try {
                return LocalDateTime.parse((String) o);
            } catch (Exception e) {
                return null;
            }
        }

        return null;
    }
}
