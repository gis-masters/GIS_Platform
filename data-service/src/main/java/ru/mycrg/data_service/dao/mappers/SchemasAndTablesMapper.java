package ru.mycrg.data_service.dao.mappers;

import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.data_service.entity.SchemasAndTables;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

public class SchemasAndTablesMapper implements RowMapper<SchemasAndTables> {

    @Override
    public SchemasAndTables mapRow(ResultSet rs, int rowNum) throws SQLException {
        SchemasAndTables sat = new SchemasAndTables();

        sat.setId(rs.getInt("id"));
        sat.setTitle(rs.getString("title"));
        sat.setDetails(rs.getString("details"));
        sat.setFolder(rs.getBoolean("is_folder"));
        sat.setIdentifier(rs.getString("identifier"));
        sat.setPath(rs.getString(PATH.getName()));
        sat.setCrs(rs.getString("crs"));
        sat.setSchema(
                toJsonNode(rs.getString("schema")));
        sat.setItemsCount(rs.getInt("items_count"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            sat.setCreatedAt(createdAt.toLocalDateTime());
        }

        Timestamp lastModified = rs.getTimestamp("last_modified");
        if (lastModified != null) {
            sat.setLastModified(lastModified.toLocalDateTime());
        }

        sat.setDocumentType(rs.getString("document_type"));

        Timestamp approveDate = rs.getTimestamp("doc_approve_date");
        if (approveDate != null) {
            sat.setDocApproveDate(approveDate.toLocalDateTime());
        }

        sat.setScale(rs.getInt("scale"));
        sat.setStatus(rs.getString("status"));
        sat.setIsPublic(rs.getBoolean("is_public"));
        sat.setReadyForFts(rs.getBoolean("ready_for_fts"));

        Timestamp terminationDate = rs.getTimestamp("doc_termination_date");
        if (terminationDate != null) {
            sat.setDocApproveDate(terminationDate.toLocalDateTime());
        }

        sat.setFiasId(rs.getLong("fias__id"));
        sat.setFiasOktmo(rs.getString("fias__oktmo"));
        sat.setFiasAdress(rs.getString("fias__address"));
        sat.setGisogdRfPublicationOrder(rs.getInt("gisogd_rf_publication_order"));

        return sat;
    }
}
