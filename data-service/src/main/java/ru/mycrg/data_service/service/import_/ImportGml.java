package ru.mycrg.data_service.service.import_;

import net.bytebuddy.utility.RandomString;
import org.geotools.gml.GMLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.TablesDao;
import ru.mycrg.data_service.dao.TablesManager;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.*;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.parsers.GmlParser;
import ru.mycrg.data_service.service.parsers.model.*;
import ru.mycrg.data_service.service.resources.DatasetService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.validation.ValidationService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@Service
public class ImportGml {

    private static final Logger log = LoggerFactory.getLogger(ImportGml.class);

    private final TablesDao tablesDao;
    private final SchemaService schemaService;
    private final TablesManager tablesManager;
    private final GmlParser gmlParser;
    private final DatasetService datasetService;
    private final ValidationService validationService;

    public ImportGml(TablesDao tablesDao,
                     SchemaService schemaService,
                     TablesManager tablesManager,
                     GmlParser gmlParser,
                     DatasetService datasetService,
                     ValidationService validationService) {
        this.tablesDao = tablesDao;
        this.schemaService = schemaService;
        this.tablesManager = tablesManager;
        this.gmlParser = gmlParser;
        this.datasetService = datasetService;
        this.validationService = validationService;
    }

    public ImportReport doImport(MultipartFile file, String title) {

        DatasetModel createdDataset = datasetService.create(new ResourceCreateDto(title));
        final String datasetIdentifier = createdDataset.getIdentifier();

        ImportReport importReport = new ImportReport(datasetIdentifier);

        try {
            List<SimpleFeatureData> features = gmlParser.parseFeatureData(file);

            getExistingSchemas(features, importReport).forEach(schema -> {
                Optional<String> oEpsg = getEpsg(features, schema);
                if (oEpsg.isPresent()) {
                    LayerReport layerReport = importLayer(file, oEpsg.get(), schema, datasetIdentifier);

                    importReport.addLayer(layerReport);
                }
            });

            return importReport;
        } catch (GMLException e) {
            throw new DataServiceException(e.getMessage());
        }
    }

    private Optional<String> getEpsg(List<SimpleFeatureData> features, SchemaDto schema) {
        return features.stream()
                       .filter(tableDto -> schema.getName().toLowerCase()
                                                 .startsWith(tableDto.getSchemaName().toLowerCase()))
                       .findFirst()
                       .map(SimpleFeatureData::getEpsgCode);
    }

    private LayerReport importLayer(MultipartFile file, String epsgCode, SchemaDto schema, String datasetIdentifier) {
        LayerReport layerReport = new LayerReport(schema.getName());

        try {
            TableCreateDto tableCreateDto = new TableCreateDto(schema.getTitle());
            tableCreateDto.setName(schema.getName() + "_" + RandomString.make(6).toLowerCase());
            tableCreateDto.setSchemaId(schema.getName());
            tableCreateDto.setCrs(epsgCode);

            tablesManager.createTable(datasetIdentifier, tableCreateDto, schema);

            layerReport.setSuccess(true);

            SchemaProperties objectsBySchema = gmlParser.parseAttributes(file, schema);
            if (!objectsBySchema.getObjects().isEmpty()) {
                var createdTable = new ResourceQualifier(datasetIdentifier, tableCreateDto.getName(), TABLE);

                final int count = addRecordsToTable(createdTable, objectsBySchema);

                layerReport.setCount(count);

                if (count > 0) {
                    layerValidation(datasetIdentifier, schema.getName(), tableCreateDto.getName());
                }
            }
        } catch (Exception e) {
            String message = String.format("Таблица %s не была создана. %s", schema.getName(), e.getMessage());
            log.error(message);
            layerReport.setSuccess(false);
            layerReport.setReason(message);
        }

        return layerReport;
    }

    private Set<SchemaDto> getExistingSchemas(List<SimpleFeatureData> featureDataList,
                                              ImportReport importReport) {
        Set<SchemaDto> existedSchemas = new HashSet<>();

        for (SimpleFeatureData featureData: featureDataList) {
            Set<String> geotypePostfixBySchema = featureData.getTypeOfGeometry();
            String tableName = featureData.getSchemaName();
            Optional<SchemaDto> schemaByName = schemaService.getSchemaByName(tableName.toLowerCase());

            if (schemaByName.isPresent()) {
                String geoTypeOfSchema = schemaByName.get().getGeometryType().getType();
                String geoTypeReplaced = geoTypeOfSchema.equalsIgnoreCase("multipolygon")
                        ? "polygon"
                        : geoTypeOfSchema;

                Optional<String> appropriateGeoTypeForSchema = geotypePostfixBySchema
                        .stream()
                        .filter(Objects::nonNull)
                        .filter(postfix -> postfix.equalsIgnoreCase(geoTypeReplaced)).findFirst();

                // if table with appropriate name has another geometry type
                if (appropriateGeoTypeForSchema.isPresent()) {
                    existedSchemas.add(schemaByName.get());
                    geotypePostfixBySchema.remove(appropriateGeoTypeForSchema.get());
                }
                existedSchemas.addAll(findSchemasByPostfixAndName(geotypePostfixBySchema, tableName));
            } else {
                List<SchemaDto> tableByPostfixAndName = findSchemasByPostfixAndName(geotypePostfixBySchema, tableName);
                if (tableByPostfixAndName.isEmpty()) {
                    String msg = String.format("Схемы для таблицы %s не существует.", tableName);
                    log.error(msg);

                    LayerReport layerReport = new LayerReport(tableName);
                    layerReport.setSuccess(false);
                    layerReport.setReason(msg);
                    importReport.addLayer(layerReport);
                } else {
                    existedSchemas.addAll(tableByPostfixAndName);
                }
            }
        }

        return existedSchemas;
    }

    private List<SchemaDto> findSchemasByPostfixAndName(Set<String> geotypes, String tableName) {
        return geotypes.stream()
                       .map(geoType -> {
                           if (geoType.equalsIgnoreCase("linestring")) {
                               geoType = "line";
                           }
                           String complexName = tableName.toLowerCase() + "_" + geoType.toLowerCase();

                           return schemaService.getSchemaByName(complexName).orElse(null);
                       })
                       .filter(Objects::nonNull)
                       .collect(Collectors.toList());
    }

    private int addRecordsToTable(ResourceQualifier tableQualifier, SchemaProperties propertiesBySchema) {
        List<List<Property>> objects = propertiesBySchema.getObjects();

        Map<String, Object>[] objectList = preparePropsToDB(objects);

        try {
            tablesDao.addRecordsAsBatch(tableQualifier, objectList);

            return objectList.length;
        } catch (CrgDaoException e) {
            String msg = "Ошибка при добавлении записи в таблицу " + tableQualifier + ". " + e.getMessage();
            log.error(msg);
        }

        return 0;
    }

    private Map<String, Object>[] preparePropsToDB(List<List<Property>> objects) {
        Map<String, Object>[] objectMaps = new HashMap[objects.size()];

        for (int i = 0, objectsSize = objects.size(); i < objectsSize; i++) {
            List<Property> props = objects.get(i);
            Map<String, Object> propertiesForDB = new HashMap<>();

            for (Property property: props) {
                ValueType type = property.getType();
                Object value = null;
                if (nonNull(property.getValue())) {
                    value = type.equals(ValueType.GEOMETRY)
                            ? property.getValue()
                            : convertToNecessaryType(property.getValue().toString(), type);
                }
                propertiesForDB.put(property.getName().toLowerCase(), value);
            }

            objectMaps[i] = propertiesForDB;
        }

        return objectMaps;
    }

    private Object convertToNecessaryType(String stringValue, ValueType type) {
        switch (type) {
            case DOUBLE:
                return Double.parseDouble(stringValue);
            case INT:
                return Integer.parseInt(stringValue);
            default:
                return stringValue;
        }
    }

    private void layerValidation(String datasetIdentifier, String schemaId, String tableName) {
        ExportResourceModel resourceModel = new ExportResourceModel();
        resourceModel.setDataset(datasetIdentifier);
        resourceModel.setSchemaId(schemaId);
        resourceModel.setTable(tableName);

        List<ExportResourceModel> exportResourceModels = new ArrayList<>();
        exportResourceModels.add(resourceModel);

        ValidationRequestDto dto = new ValidationRequestDto();
        dto.setResources(exportResourceModels);
        validationService.validate(dto);
    }
}
