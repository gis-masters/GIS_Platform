package ru.mycrg.data_service.dao.mappers;

import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.enums.ProcessType;
import tools.jackson.databind.JsonNode;

import java.sql.ResultSet;
import java.sql.SQLException;

import static ru.mycrg.http_client.JsonConverter.toJsonNode;

public class ProcessRowMapper implements RowMapper<Process> {

    @Override
    public Process mapRow(ResultSet rs, int rowNum) throws SQLException {
        final Process process = new Process();
        process.setId(rs.getLong("id"));
        process.setUserName(rs.getString("user_name"));
        process.setTitle(rs.getString("title"));
        process.setType(ProcessType.valueOf(rs.getString("type")));
        process.setStatus(ProcessStatus.valueOf(rs.getString("status")));

        final Object extra = rs.getObject("extra");
        if (extra != null) {
            JsonNode jsonNode = toJsonNode(extra);
            process.setExtra(jsonNode.findValue("value"));
        }

        final Object details = rs.getObject("details");
        if (details != null) {
            JsonNode jsonNode = toJsonNode(details);
            process.setDetails(jsonNode.findValue("value"));
        }

        return process;
    }
}
