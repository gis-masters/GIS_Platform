package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.FiasDao;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dto.FullAddressDto;
import ru.mycrg.data_service.dto.LocalityDto;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.parsers.XmlFiasParser;

import java.io.File;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.apache.commons.lang3.StringUtils.isNumeric;

@Service
public class FiasService {

    private final XmlFiasParser fiasParser;
    private final FiasDao fiasDao;
    private final DatasourceFactory datasourceFactory;
    private Statement statement;

    private final Logger log = LoggerFactory.getLogger(FiasService.class);

    public FiasService(XmlFiasParser fiasParser,
                       FiasDao fiasDao,
                       DatasourceFactory datasourceFactory) {
        this.fiasParser = fiasParser;
        this.fiasDao = fiasDao;
        this.datasourceFactory = datasourceFactory;
        try {
            Connection connection = datasourceFactory.getDataSource("crg_data_service").getConnection();
            statement = connection.createStatement();
        } catch (SQLException e) {
            String msg = "Не удалось подключиться к базе данных crg_data_service";
            log.error(msg);
        }
    }

    public void loadFiasDataToDB(String folderPath) {

        File xmlFile = new File(folderPath);

        if (xmlFile.isDirectory()) {
            File[] files = xmlFile.listFiles();
            if (files != null && files.length != 0) {

                List<File> fileNames = Arrays.asList(files);

                fileNames.forEach(file -> fiasParser.parseAndWriteData(file, fiasDao));
            }
        } else {
            String msg = "Переданный аргумент не является директорией.";
            log.error(msg);

            throw new DataServiceException(msg);
        }
    }

    public void truncateFiasData() {
        String schemaName = "fiaz";
        String sqlGetAllTableBySchema = "SELECT table_name" +
                " FROM information_schema.tables" +
                " WHERE table_schema = '" + schemaName + "';";
        String sqlTruncateTableInSchema = "TRUNCATE ";
        try {
            ResultSet allTablesBySchema = statement.executeQuery(sqlGetAllTableBySchema);
            List<String> recordAsTableName = getRecordAsTableName(allTablesBySchema);
            for (int i = 0; i < recordAsTableName.size(); i++) {
                String separator = i == recordAsTableName.size() - 1 ? "; " : ",";
                sqlTruncateTableInSchema += schemaName + "." + recordAsTableName.get(i) + separator;
            }
            statement.execute(sqlTruncateTableInSchema);
        } catch (SQLException e) {
            String message = "Couldn't execute sql statement. " + e.getMessage();
            log.error(message);

            throw new DataServiceException(message);
        }
    }

    public void generateFullAddressesAndSave() {
        String sql = "INSERT INTO fiaz.full_address (objectid, fulladdress, oktmo) " +
                "SELECT houses.objectid         as objectid,\n" +
                "       concat(\n" +
                "               CASE\n" +
                "                   WHEN address6.typename is null THEN ''\n" +
                "                   ELSE concat(address6.typename, ' ', address6.name, ', ')\n" +
                "                   END,\n" +
                "               CASE\n" +
                "                   WHEN address5.typename is null THEN ''\n" +
                "                   ELSE concat(address5.typename, ' ', address5.name, ', ')\n" +
                "                   END,\n" +
                "               address4.typename, ' ', address4.name, ', ',\n" +
                "               address3.typename, ' ', address3.name, ', ',\n" +
                "               address2.typename, ' ', address2.name, ', ',\n" +
                "               address.typename, ' ', address.name, ', ',\n" +
                "               'д.', housenum) as fulladdress,\n" +
                "       m_hierarchy.oktmo       as oktmo\n" +
                "FROM fiaz.houses as houses\n" +
                "         join fiaz.mun_hierarchy m_hierarchy on m_hierarchy.objectid = houses.objectid\n" +
                "         join fiaz.address_objects address on address.objectid = m_hierarchy.parentobjid\n" +
                "         join fiaz.mun_hierarchy m2 on address.objectid = m2.objectid\n" +
                "         join fiaz.address_objects address2 on address2.objectid = m2.parentobjid\n" +
                "         join fiaz.mun_hierarchy m3 on address2.objectid = m3.objectid\n" +
                "         join fiaz.address_objects address3 on address3.objectid = m3.parentobjid\n" +
                "         join fiaz.mun_hierarchy m4 on address3.objectid = m4.objectid\n" +
                "         join fiaz.address_objects address4 on address4.objectid = m4.parentobjid\n" +
                "         left join fiaz.mun_hierarchy m5 on address4.objectid = m5.objectid\n" +
                "         left join fiaz.address_objects address5 on address5.objectid = m5.parentobjid\n" +
                "         left join fiaz.mun_hierarchy m6 on address5.objectid = m6.objectid\n" +
                "         left join fiaz.address_objects address6 on address6.objectid = m6.parentobjid\n" +
                "where houses.isactual = true" +
                "  and houses.isactive = true" +
                "  and m_hierarchy.isactive = true" +
                "  and address.isactual = true" +
                "  and address.isactive = true" +
                "  and m2.isactive = true" +
                "  and address2.isactual = true" +
                "  and address2.isactive = true" +
                "  and m3.isactive = true" +
                "  and address3.isactual = true" +
                "  and address3.isactive = true" +
                "  and m4.isactive = true" +
                "  and address4.isactual = true" +
                "  and address4.isactive = true";

        try {
            statement.execute(sql);
        } catch (SQLException e) {
            String message = "Couldn't execute sql statement. " + e.getMessage();
            log.error(message);

            throw new DataServiceException(message);
        }
    }

    public void generateLocalityData() {
        String sql = "INSERT INTO fiaz.locality_oktmo (objectid, locality, oktmo)\n" +
                "SELECT addr.objectid                                                                as objectid, " +
                "       concat(addr2.typename, ' ', addr2.name, ', ', addr.typename, ' ', addr.name) as locality, " +
                "       m.oktmo                                                                      as oktmo " +
                "FROM fiaz.mun_hierarchy m " +
                "         join fiaz.address_objects addr on addr.objectid = m.objectid " +
                "         join fiaz.address_objects addr2 on addr2.objectid = m.parentobjid " +
                "where addr.level in ('4', '5', '6') " +
                "  and addr.isactual = true " +
                "  and addr.isactive = true " +
                "  and addr2.isactual = true " +
                "  and addr2.isactive = true " +
                "  and m.isactive = true; ";

        try {
            statement.execute(sql);
        } catch (SQLException e) {
            String message = "Couldn't execute sql statement. " + e.getMessage();
            log.error(message);

            throw new DataServiceException(message);
        }
    }

    public List<FullAddressDto> getAddresses(String address) {
        List<FullAddressDto> fullAddresses = new ArrayList<>();

        String[] partsOfAddress = address.split("[\\s,]+");
        String params = "";

        for (int i = 0; i < partsOfAddress.length; i++) {
            if (i == 0) {
                params += " lower(fulladdress) like lower('%" + partsOfAddress[i] + "%')";
            } else if (i == partsOfAddress.length - 1) {
                String lastPart = partsOfAddress[i];
                if (isNumeric(lastPart)) {
                    params += " and lower(fulladdress) like lower('%д." + partsOfAddress[i] + "%')";
                } else {
                    params += " and lower(fulladdress) like lower('%" + partsOfAddress[i] + "%')";
                }
            } else {
                params += " and lower(fulladdress) like lower('%" + partsOfAddress[i] + "%')";
            }
        }
        params += " order by fulladdress limit 10";

        String query = " SELECT * " +
                "from fiaz.full_address " +
                "where " + params;
        try {
            ResultSet result = statement.executeQuery(query);
            fullAddresses.addAll(getRecordAsFullAddress(result));
        } catch (SQLException e) {
            String message = "Couldn't execute sql statement. " + e.getMessage();
            log.error(message);

            throw new DataServiceException(message);
        }

        return fullAddresses;
    }

    public List<FullAddressDto> getAddressesByCompleteMatch(String address) {
        List<FullAddressDto> fullAddresses = new ArrayList<>();

        String query = " SELECT * " +
                "from fiaz.full_address " +
                "where lower(fulladdress) like lower('%" + address + "%')" +
                " limit 10";
        try {
            ResultSet result = statement.executeQuery(query);
            fullAddresses.addAll(getRecordAsFullAddress(result));
        } catch (SQLException e) {
            String message = "Couldn't execute sql statement. " + e.getMessage();
            log.error(message);

            throw new DataServiceException(message);
        }

        return fullAddresses;
    }

    public List<LocalityDto> getLocalities(String address) {
        List<LocalityDto> localities = new ArrayList<>();

        String[] partsOfAddress = address.split("[\\s,]+");
        String params = "";

        for (int i = 0; i < partsOfAddress.length; i++) {
            params += i == 0
                    ? " lower(locality) like lower('%" + partsOfAddress[i] + "%')"
                    : " and lower(locality) like lower('%" + partsOfAddress[i] + "%')";
        }

        String query = " SELECT * " +
                "from fiaz.locality_oktmo " +
                "where " + params + " order by locality limit 10 ";
        try {
            ResultSet result = statement.executeQuery(query);
            localities.addAll(getRecordAsLocality(result));
        } catch (SQLException e) {
            String message = "Couldn't execute sql statement. " + e.getMessage();
            log.error(message);

            throw new DataServiceException(message);
        }

        return localities;
    }

    private List<FullAddressDto> getRecordAsFullAddress(ResultSet rs) throws SQLException {
        List<FullAddressDto> fullAddresses = new ArrayList<>();
        while (rs.next()) {
            FullAddressDto fullAddressDto = new FullAddressDto();

            fullAddressDto.setObjectId(rs.getLong("objectid"));
            fullAddressDto.setFullAddress(rs.getString("fulladdress"));
            fullAddressDto.setOktmo(rs.getString("oktmo"));
            fullAddresses.add(fullAddressDto);
        }

        return fullAddresses;
    }

    private List<LocalityDto> getRecordAsLocality(ResultSet rs) throws SQLException {
        List<LocalityDto> localities = new ArrayList<>();
        while (rs.next()) {
            LocalityDto localityDto = new LocalityDto();

            localityDto.setObjectId(rs.getLong("objectid"));
            localityDto.setLocality(rs.getString("locality"));
            localityDto.setOktmo(rs.getString("oktmo"));
            localities.add(localityDto);
        }

        return localities;
    }

    private List<String> getRecordAsTableName(ResultSet rs) throws SQLException {
        List<String> tableNames = new ArrayList<>();
        while (rs.next()) {
            tableNames.add(rs.getString("table_name"));
        }

        return tableNames;
    }
}
