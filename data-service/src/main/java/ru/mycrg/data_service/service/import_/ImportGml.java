package ru.mycrg.data_service.service.import_;

import net.bytebuddy.utility.RandomString;
import org.geotools.gml.GMLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.utils.GeometryHelper;
import ru.mycrg.data_service.dto.*;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.datasets.requests.CreateDatasetRequest;
import ru.mycrg.data_service.service.cqrs.tables.requests.CreateTableRequest;
import ru.mycrg.data_service.service.import_.exceptions.ImportException;
import ru.mycrg.data_service.service.import_.model.ImportGmlModel;
import ru.mycrg.data_service.service.parsers.GmlParser;
import ru.mycrg.data_service.service.parsers.model.FeatureData;
import ru.mycrg.data_service.service.parsers.model.FeatureObject;
import ru.mycrg.data_service.service.parsers.model.FeatureProperty;
import ru.mycrg.data_service.service.parsers.model.SimpleFeatureData;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service.service.validation.ValidationService;
import ru.mycrg.data_service.util.CrgScriptEngine;
import ru.mycrg.data_service_contract.dto.ImportLayerReport;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.mediator.Mediator;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static ru.mycrg.data_service_contract.enums.ValueType.STRING;

@Service
public class ImportGml {

    private static final Logger log = LoggerFactory.getLogger(ImportGml.class);

    private final RecordsDao recordsDao;
    private final SchemaService schemaService;
    private final GeometryHelper geometryHelper;
    private final GmlParser gmlParser;
    private final ValidationService validationService;
    private final CrgScriptEngine scriptEngine;
    private final TableService tableService;
    private final Mediator mediator;

    public ImportGml(RecordsDao recordsDao,
                     SchemaService schemaService,
                     GeometryHelper geometryHelper,
                     GmlParser gmlParser,
                     ValidationService validationService,
                     CrgScriptEngine scriptEngine,
                     TableService tableService,
                     Mediator mediator) {
        this.recordsDao = recordsDao;
        this.schemaService = schemaService;
        this.geometryHelper = geometryHelper;
        this.gmlParser = gmlParser;
        this.validationService = validationService;
        this.scriptEngine = scriptEngine;
        this.tableService = tableService;
        this.mediator = mediator;
    }

    public ImportReport doImport(Resource file, ImportGmlModel importGmlModel) {
        try {
            ImportReport importResult = new ImportReport();

            ResourceCreateDto dataset = new ResourceCreateDto(importGmlModel.getTitle(),
                                                              importGmlModel.getDetails(),
                                                              importGmlModel.getOktmo(),
                                                              importGmlModel.getDocumentType(),
                                                              importGmlModel.getDocDateApprove(),
                                                              importGmlModel.getScale());

            DatasetModel createdDataset = mediator.execute(new CreateDatasetRequest(dataset));
            final String datasetIdentifier = createdDataset.getIdentifier();
            importResult.setDatasetIdentifier(datasetIdentifier);

            List<SimpleFeatureData> features = gmlParser.parseFeatureData(file);
            List<ImportLayerReport> importLayerReports = new ArrayList<>();

            getExistingSchemas(features, importLayerReports).forEach(schema -> {
                Optional<String> oEpsg = getEpsg(features, schema);
                if (oEpsg.isEmpty()) {
                    ImportLayerReport importLayerReport = new ImportLayerReport();
                    importLayerReport.setSchemaId(schema.getName());
                    importLayerReport.setTableTitle(schema.getTableName());
                    importLayerReport.setReason("Не удалось выполнить импорт. Неверно указана система координат");
                    importLayerReports.add(importLayerReport);

                    return;
                }

                ImportLayerReport importLayerReport = importLayer(file, oEpsg.get(), schema, datasetIdentifier,
                                                                  importGmlModel.isInvertCoordinates());

                if (importLayerReport.getSuccessCount() > 0 || Objects.nonNull(importLayerReport.getReason())) {
                    importLayerReports.add(importLayerReport);
                }
            });

            importResult.setImportLayerReports(importLayerReports);

            return importResult;
        } catch (GMLException e) {
            throw new ImportException(e.getMessage());
        } catch (Exception e) {
            throw new ImportException("Не удалось выполнить импорт. Причина: " + e.getMessage());
        }
    }

    private Optional<String> getEpsg(List<SimpleFeatureData> features, SchemaDto schema) {
        return features.stream()
                       .filter(tableDto -> schema.getName().toLowerCase()
                                                 .startsWith(tableDto.getSchemaName().toLowerCase()))
                       .findFirst()
                       .map(SimpleFeatureData::getEpsgCode);
    }

    private ImportLayerReport importLayer(Resource file,
                                          String epsgCode,
                                          SchemaDto schema,
                                          String datasetIdentifier,
                                          boolean invertCoordinates) {
        ImportLayerReport importLayerReport = new ImportLayerReport(schema.getName(), epsgCode);

        try {
            TableCreateDto tableCreateDto = new TableCreateDto(schema.getTitle());
            tableCreateDto.setName(schema.getName() + "_" + RandomString.make(6).toLowerCase());
            tableCreateDto.setSchemaId(schema.getName());
            tableCreateDto.setCrs(epsgCode);

            FeatureData featureData = gmlParser.parseAttributes(file, schema, invertCoordinates);

            if (schema.getCalcFiledFunction() != null) {
                calculateFieldsByCustomRules(featureData, schema.getCalcFiledFunction());
            }

            if (!featureData.getObjects().isEmpty()) {
                ResourceQualifier tableQualifier = new ResourceQualifier(datasetIdentifier, tableCreateDto.getName());

                mediator.execute(new CreateTableRequest(tableCreateDto, tableQualifier));

                int countOfAddedRecords = addRecordsToTable(tableQualifier, featureData);

                geometryHelper.makeValid(tableQualifier.getSchema(), tableQualifier.getTable());

                if (countOfAddedRecords > 0) {
                    runValidation(datasetIdentifier, schema.getName(), tableCreateDto.getName());
                }

                importLayerReport.setSuccess(true);
                importLayerReport.setTableIdentifier(tableCreateDto.getName());
                importLayerReport.setSuccessCount(countOfAddedRecords);
                importLayerReport.setTableTitle(schema.getTitle());
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
            String schemaName = featureData.getSchemaName();
            Optional<SchemaDto> schemaByName = schemaService.getSchemaByName(schemaName.toLowerCase());

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
                existedSchemas.addAll(findSchemasByPostfixAndName(geometryTypes, schemaName));
            } else {
                List<SchemaDto> tableByPostfixAndName = findSchemasByPostfixAndName(geometryTypes, schemaName);
                if (tableByPostfixAndName.isEmpty()) {
                    String msg = String.format("Схемы для таблицы %s не существует.", schemaName);
                    log.warn(msg);

                    importLayerReports.add(new ImportLayerReport(schemaName, false, msg));
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
            recordsDao.addRecordsAsBatch(tableQualifier, objectList);

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
                propertiesForDB.put(featureProperty.getName().toLowerCase(),
                                    convertToNecessaryType(featureProperty.getValue(), featureProperty.getType()));
            }

            objectMaps[i] = propertiesForDB;
        }

        return objectMaps;
    }

    private Object convertToNecessaryType(Object value, ValueType type) {
        if (isNull(value)) {
            return null;
        }

        try {
            switch (type) {
                case DOUBLE:
                    return Double.parseDouble(value.toString().replace(",", "."));
                case INT:
                    return Integer.parseInt(value.toString());
                case GEOMETRY:
                    return value;
                default:
                    return value.toString();
            }
        } catch (NumberFormatException ex) {
            log.warn("Problem with converting to necessary type. {}", ex.getMessage());

            return null;
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
