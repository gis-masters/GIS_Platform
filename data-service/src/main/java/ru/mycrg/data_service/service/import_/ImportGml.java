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
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.import_.model.DataTable;
import ru.mycrg.data_service.service.import_.model.GmlInfo;
import ru.mycrg.data_service.service.import_.model.ImportLayerReport;
import ru.mycrg.data_service.service.import_.model.ImportReport;
import ru.mycrg.data_service.service.parsers.GmlParser;
import ru.mycrg.data_service.service.parsers.model.FeatureData;
import ru.mycrg.data_service.service.parsers.model.FeatureObject;
import ru.mycrg.data_service.service.parsers.model.FeatureProperty;
import ru.mycrg.data_service.service.parsers.model.SimpleFeatureData;
import ru.mycrg.data_service.service.resources.DatasetService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service.service.validation.ValidationService;
import ru.mycrg.data_service.util.CrgScriptEngine;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;
import static ru.mycrg.data_service_contract.enums.ValueType.STRING;

@Service
public class ImportGml {

    private static final Logger log = LoggerFactory.getLogger(ImportGml.class);

    private final TablesDao tablesDao;
    private final SchemaService schemaService;
    private final TablesManager tablesManager;
    private final GmlParser gmlParser;
    private final DatasetService datasetService;
    private final ValidationService validationService;
    private final CrgScriptEngine scriptEngine;
    private final TableService tableService;

    public ImportGml(TablesDao tablesDao,
                     SchemaService schemaService,
                     TablesManager tablesManager,
                     GmlParser gmlParser,
                     DatasetService datasetService,
                     ValidationService validationService,
                     CrgScriptEngine scriptEngine,
                     TableService tableService) {
        this.tablesDao = tablesDao;
        this.schemaService = schemaService;
        this.tablesManager = tablesManager;
        this.gmlParser = gmlParser;
        this.datasetService = datasetService;
        this.validationService = validationService;
        this.scriptEngine = scriptEngine;
        this.tableService = tableService;
    }

    public ImportReport doImport(MultipartFile file, GmlInfo gmlInfo) {
        ImportReport importResult = new ImportReport();

        LocalDate dateTime = LocalDate.parse(gmlInfo.getDocDateApprove());

        ResourceCreateDto resource = new ResourceCreateDto(gmlInfo.getTitle(), gmlInfo.getDetails(),
                                                           gmlInfo.getOktmo(), gmlInfo.getDocumentType(),
                                                           dateTime.atStartOfDay(), gmlInfo.getScale());

        DatasetModel createdDataset = datasetService.create(resource);
        final String datasetIdentifier = createdDataset.getIdentifier();
        importResult.setDatasetIdentifier(datasetIdentifier);

        try {
            List<SimpleFeatureData> features = gmlParser.parseFeatureData(file);
            List<DataTable> createdDataTables = new ArrayList<>();
            List<ImportLayerReport> importLayerReports = new ArrayList<>();

            getExistingSchemas(features, importLayerReports).forEach(schema -> {
                Optional<String> oEpsg = getEpsg(features, schema);
                if (oEpsg.isPresent()) {
                    String epsgCode = oEpsg.get();
                    ImportLayerReport importLayerReport = importLayer(file, epsgCode, schema, datasetIdentifier,
                                                                      gmlInfo.isInvertCoordinates());
                    DataTable dataTable = new DataTable(schema.getTitle(),
                                                        importLayerReport.getTableIdentifier(),
                                                        epsgCode,
                                                        schema.getName());

                    if (importLayerReport.getSuccessCount() > 0 || Objects.nonNull(importLayerReport.getReason())) {
                        importLayerReports.add(importLayerReport);
                    }
                    if (importLayerReport.isSuccess()) {
                        createdDataTables.add(dataTable);
                    }
                }
            });

            importResult.setImportLayerReports(importLayerReports);
            importResult.setCreatedTables(createdDataTables);

            return importResult;
        } catch (GMLException e) {
            throw new DataServiceException(e.getMessage());
        } catch (Exception e) {
            throw new DataServiceException("Не удалось выполнить импорт. Причина: " + e.getMessage());
        }
    }

    private Optional<String> getEpsg(List<SimpleFeatureData> features, SchemaDto schema) {
        return features.stream()
                       .filter(tableDto -> schema.getName().toLowerCase()
                                                 .startsWith(tableDto.getSchemaName().toLowerCase()))
                       .findFirst()
                       .map(SimpleFeatureData::getEpsgCode);
    }

    private ImportLayerReport importLayer(MultipartFile file,
                                          String epsgCode,
                                          SchemaDto schema,
                                          String datasetIdentifier,
                                          boolean invertCoordinates) {
        ImportLayerReport importLayerReport = new ImportLayerReport(schema.getName());

        try {
            TableCreateDto tableCreateDto = new TableCreateDto(schema.getTitle());
            tableCreateDto.setName(schema.getName() + "_" + RandomString.make(6).toLowerCase());
            tableCreateDto.setSchemaId(schema.getName());
            tableCreateDto.setCrs(epsgCode);

            final ResourceQualifier tableQualifier = new ResourceQualifier(datasetIdentifier, tableCreateDto.getName());

            tableService.create(tableQualifier, tableCreateDto);

            FeatureData featureData = gmlParser.parseAttributes(file, schema, invertCoordinates);

            if (schema.getCalcFiledFunction() != null) {
                calculateFieldsByCustomRules(featureData, schema.getCalcFiledFunction());
            }

            if (!featureData.getObjects().isEmpty()) {
                final int addedRecords = addRecordsToTable(tableQualifier, featureData);
                if (addedRecords > 0) {
                    runValidation(datasetIdentifier, schema.getName(), tableCreateDto.getName());
                }

                importLayerReport.setSuccess(true);
                importLayerReport.setTableIdentifier(tableCreateDto.getName());
                importLayerReport.setSuccessCount(addedRecords);
                importLayerReport.setTableTitle(schema.getTitle());
            } else {
                // delete table if no any records
                tablesManager.delete(tableQualifier);
            }
        } catch (BadRequestException e) {
            String message = String.format("Не удалось создать таблицу для слоя: %s", schema.getTitle());
            log.error(message, e.getCause());

            importLayerReport.setSuccess(false);
            importLayerReport.setReason(message);
        } catch (Exception e) {
            String message = String.format("Не удалось выполнить импорт слоя: '%s', по причине: %s",
                                           schema.getTitle(), e.getMessage());
            log.error(message, e.getCause());

            importLayerReport.setSuccess(false);
            importLayerReport.setReason(message);
        }

        return importLayerReport;
    }

    private Set<SchemaDto> getExistingSchemas(List<SimpleFeatureData> featureDataList,
                                              List<ImportLayerReport> importLayerReports) {
        Set<SchemaDto> existedSchemas = new HashSet<>();

        for (SimpleFeatureData featureData: featureDataList) {
            Set<String> geometryTypes = featureData.getGeometryTypes();
            String tableName = featureData.getSchemaName();
            Optional<SchemaDto> schemaByName = schemaService.getSchemaByName(tableName.toLowerCase());

            if (schemaByName.isPresent()) {
                String geoTypeOfSchema = schemaByName.get().getGeometryType().getType();
                String geoTypeReplaced = geoTypeOfSchema.equalsIgnoreCase("multipolygon")
                        ? "polygon"
                        : geoTypeOfSchema;

                Optional<String> appropriateGeoTypeForSchema = geometryTypes
                        .stream()
                        .filter(Objects::nonNull)
                        .filter(postfix -> postfix.equalsIgnoreCase(geoTypeReplaced)).findFirst();

                // if table with appropriate name has another geometry type
                if (appropriateGeoTypeForSchema.isPresent()) {
                    existedSchemas.add(schemaByName.get());
                    geometryTypes.remove(appropriateGeoTypeForSchema.get());
                }
                existedSchemas.addAll(findSchemasByPostfixAndName(geometryTypes, tableName));
            } else {
                List<SchemaDto> tableByPostfixAndName = findSchemasByPostfixAndName(geometryTypes, tableName);
                if (tableByPostfixAndName.isEmpty()) {
                    String msg = String.format("Схемы для таблицы %s не существует.", tableName);
                    log.error(msg);

                    ImportLayerReport importLayerReport = new ImportLayerReport(tableName);
                    importLayerReport.setSuccess(false);
                    importLayerReport.setReason(msg);
                    importLayerReports.add(importLayerReport);
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

    private int addRecordsToTable(ResourceQualifier tableQualifier, FeatureData propertiesBySchema) {
        List<FeatureObject> objects = propertiesBySchema.getObjects();

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

    private Map<String, Object>[] preparePropsToDB(List<FeatureObject> objects) {
        Map<String, Object>[] objectMaps = new HashMap[objects.size()];

        for (int i = 0, objectsSize = objects.size(); i < objectsSize; i++) {
            final FeatureObject featureObject = objects.get(i);

            Map<String, Object> propertiesForDB = new HashMap<>();
            for (FeatureProperty featureProperty: featureObject.getProperties()) {
                ValueType type = featureProperty.getType();
                Object value = null;
                if (nonNull(featureProperty.getValue())) {
                    value = type.equals(ValueType.GEOMETRY)
                            ? featureProperty.getValue()
                            : convertToNecessaryType(featureProperty.getValue().toString(), type);
                }
                propertiesForDB.put(featureProperty.getName().toLowerCase(), value);
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

    private void runValidation(String datasetIdentifier, String schemaId, String tableName) {
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

    private void calculateFieldsByCustomRules(FeatureData featureData, String calcFieldFunction) {
        featureData.getObjects().forEach(featureObject -> {
            Map<String, Object> props = new HashMap<>();
            final List<FeatureProperty> properties = featureObject.getProperties();
            properties.forEach(featureProperty -> props.put(featureProperty.getName(),
                                                            featureProperty.getValue()));

            var calculatedFields = (Map<String, Object>) scriptEngine.invokeFunction(props, calcFieldFunction);
            calculatedFields.forEach((key, value) -> {
                properties.add(new FeatureProperty(key, value, STRING));
            });
        });
    }
}
