package ru.mycrg.data_service.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.ddl.DdlTables;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.exceptions.TransformationException;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.parsers.XmlParser;
import ru.mycrg.data_service.service.parsers.exceptions.XmlParserException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service.util.CrsHandler;
import ru.mycrg.data_service.util.ImportValidationHandler;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ImportMp implements Importer {

    private final Logger log = LoggerFactory.getLogger(ImportMp.class);
    private static final String SCHEMA_NAME = "mp";

    private final RecordsDao recordsDao;
    private final XmlParser xmlParser;
    private final SchemaService schemaService;
    private final TableService tableService;
    private final CrsHandler crsHandler;
    private final DdlTables ddlTables;

    public ImportMp(RecordsDao recordsDao, XmlParser xmlParser, SchemaService schemaService,
                    TableService tableService, CrsHandler crsHandler, DdlTables ddlTables) {
        this.recordsDao = recordsDao;
        this.xmlParser = xmlParser;
        this.schemaService = schemaService;
        this.tableService = tableService;
        this.crsHandler = crsHandler;
        this.ddlTables = ddlTables;
    }

    @Override
    public String getType() {
        return "mp";
    }

    /**
     * Импорт xml файла межевого плана в БД. При импорте межевого плана происходит парсинг файла, проверка типов полей,
     * согласно схеме БД, добавление записи в БД
     *
     * @param file  xml файл межевого плана
     * @param table Название таблицы в БД куда осуществляется импорт данных
     *
     * @return objectId Возвращает id добавленной в БД записи
     *
     * @throws DataServiceException Если парсинг xml  файла не выполнился успешно и если новая запись не добавлена в БД
     * @throws BadRequestException  Если преобразование геометрии не удалось
     */
    public Long doImport(MultipartFile file, ResourceQualifier table) {
        IResourceModel tableModel = tableService.getInfo(table);
        Optional<SchemaDto> schemaOfCurrentLayer = schemaService.getSchemaByName(tableModel.getSchemaId());
        if (schemaOfCurrentLayer.isEmpty()) {
            throw new NotFoundException(SchemaDto.class, tableModel.getSchemaId());
        }
        Optional<SchemaDto> schemaOfMp = schemaService.getSchemaByName(SCHEMA_NAME);
        if (schemaOfMp.isEmpty()) {
            throw new NotFoundException(SchemaDto.class, SCHEMA_NAME);
        }

        List<SimplePropertyDto> crossedProperties = getCrossedPropertiesFromTwoSchemas(schemaOfCurrentLayer.get(),
                                                                                       schemaOfMp.get());

        try {
            Map<String, Object> dataForSavingToDB = xmlParser.parseByScheme(
                    file,
                    crossedProperties,
                    crsHandler.extractCrsNumber(tableModel.getCrs()),
                    schemaOfCurrentLayer.get().getName().equalsIgnoreCase("zu2"));
            Map<String, Object> dataForSavingToDBValid = ImportValidationHandler
                    .removeNonMatchingBySchemaProperties(dataForSavingToDB, crossedProperties);

            List<String> columnNamesInTable = ddlTables.getAllColumnNames(table.getTable());
            Map<String, Object> propertiesMatchingToDBColumns = getAllPropertiesMatchingToDBColumns(
                    dataForSavingToDBValid, columnNamesInTable);

            return recordsDao.addRecord(table, new RecordEntity(propertiesMatchingToDBColumns)).getId();
        } catch (CrgDaoException e) {
            log.error(e.getMessage());

            throw new DataServiceException("Ошибка при добавлении записи в таблицу " + table);
        } catch (XmlParserException e) {
            throw new DataServiceException(e.getMessage());
        } catch (TransformationException e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    private List<SimplePropertyDto> getCrossedPropertiesFromTwoSchemas(SchemaDto currentSchema, SchemaDto schemaOfMp) {
        List<SimplePropertyDto> crossedProperties = new ArrayList<>();

        for (SimplePropertyDto currentProperty: currentSchema.getProperties()) {
            List<SimplePropertyDto> matchingFields = schemaOfMp
                    .getProperties()
                    .stream()
                    .filter(mpProperty -> currentProperty.getName().equalsIgnoreCase(mpProperty.getName()))
                    .collect(Collectors.toList());
            crossedProperties.addAll(matchingFields);
        }

        return crossedProperties;
    }

    private Map<String, Object> getAllPropertiesMatchingToDBColumns(Map<String, Object> dataForSavingToDB,
                                                                    List<String> columnNames) {
        Map<String, Object> matchingByColumnsProperties = new HashMap<>();
        for (String columnName: columnNames) {
            if (dataForSavingToDB.containsKey(columnName)) {
                matchingByColumnsProperties.put(columnName, dataForSavingToDB.get(columnName));
            }
        }

        return matchingByColumnsProperties;
    }
}
