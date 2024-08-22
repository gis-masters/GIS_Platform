package ru.mycrg.data_service.service.import_;

import net.bytebuddy.utility.RandomString;
import org.jetbrains.annotations.Nullable;
import org.postgis.PGgeometry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import ru.mycrg.common_utils.CrgScriptEngine;
import ru.mycrg.data_service.dao.GeometryDao;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.ExportResourceModel;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.dto.ValidationRequestDto;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.cqrs.tables.requests.CreateTableRequest;
import ru.mycrg.data_service.service.import_.exceptions.ImportException;
import ru.mycrg.data_service.service.parsers.GmlParser;
import ru.mycrg.data_service.service.parsers.model.FeatureData;
import ru.mycrg.data_service.service.parsers.model.FeatureObject;
import ru.mycrg.data_service.service.parsers.model.FeatureProperty;
import ru.mycrg.data_service.service.parsers.model.SimpleFeatureData;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.validation.ValidationService;
import ru.mycrg.data_service_contract.dto.ImportLayerReport;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.mediator.Mediator;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_EPSG_METRE;
import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.getPropertiesWithCalculatedFunctions;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service_contract.enums.ValueType.STRING;

@Service
public class GmlImporter {

    private static final Logger log = LoggerFactory.getLogger(GmlImporter.class);

    private final RecordsDao recordsDao;
    private final ISchemaTemplateService schemaService;
    private final GeometryDao geometryDao;
    private final GmlParser gmlParser;
    private final ValidationService validationService;
    private final CrgScriptEngine crgScriptEngine;
    private final Mediator mediator;
    private final FileStorageService fileStorageService;

    public GmlImporter(RecordsDao recordsDao,
                       @Qualifier("schemaTemplateServiceBase") ISchemaTemplateService schemaService,
                       GeometryDao geometryDao,
                       GmlParser gmlParser,
                       ValidationService validationService,
                       CrgScriptEngine crgScriptEngine,
                       Mediator mediator,
                       FileStorageService fileStorageService) {
        this.recordsDao = recordsDao;
        this.schemaService = schemaService;
        this.geometryDao = geometryDao;
        this.gmlParser = gmlParser;
        this.validationService = validationService;
        this.crgScriptEngine = crgScriptEngine;
        this.mediator = mediator;
        this.fileStorageService = fileStorageService;
    }

    /**
     * Импорт данных из GML файла в набор данных.
     */
    public ImportReport doImport(String path, String datasetIdentifier, Boolean invertedCoordinates) {
        Resource file;
        try {
            file = fileStorageService.loadFromMainStorage(path);
        } catch (Exception e) {
            String msg = String.format("Не удалось загрузить файл по пути: '%s'", path);
            log.error(msg, e.getCause());

            throw new DataServiceException(msg);
        }

        try {
            ImportReport importResult = new ImportReport();

            importResult.setDatasetIdentifier(datasetIdentifier);

            String bboxCrs = gmlParser.getBboxCrs(file);
            List<SimpleFeatureData> features = gmlParser.parseFeatures(file);
            List<ImportLayerReport> importLayerReports = new ArrayList<>();

            getExistingSchemas(features, importLayerReports).forEach(schema -> {
                Optional<String> oLayerEpsg = getEpsgForLayer(features, schema);

                FeatureData featureData;
                String epsgFromLayer;
                try {
                    String defaultCrs = nonNull(bboxCrs) ? bboxCrs : DEFAULT_EPSG_METRE;

                    featureData = gmlParser.parseAttributes(file, schema, invertedCoordinates, defaultCrs);
                    epsgFromLayer = getEpsgFromFeature(oLayerEpsg, featureData);
                } catch (Exception e) {
                    logError("Не удалось распарсить атрибуты фичи: " + schema.getName(), e);

                    ImportLayerReport importLayerReport = new ImportLayerReport();
                    importLayerReport.setSchemaId(schema.getName());
                    importLayerReport.setTableTitle(schema.getTableName());
                    importLayerReport.setReason("Не удалось выполнить импорт. Не удалось распарсить атрибуты фичи");
                    importLayerReports.add(importLayerReport);

                    return;
                }

                String epsg = nonNull(epsgFromLayer) && !epsgFromLayer.isEmpty() ? epsgFromLayer : bboxCrs;
                ImportLayerReport importLayerReport = importLayer(featureData, epsg, schema, datasetIdentifier);
                String styleName = schema.getStyleName();
                importLayerReport.setStyleName((styleName != null) ? styleName : schema.getName());

                importLayerReports.add(importLayerReport);
            });

            importResult.setImportLayerReports(importLayerReports);

            return importResult;
        } catch (Exception e) {
            String msg = "Не удалось выполнить импорт. Причина: " + e.getMessage();
            logError(msg, e);

            throw new ImportException(msg);
        }
    }

    @Nullable
    private static String getEpsgFromFeature(Optional<String> oLayerEpsg, FeatureData featureData) {
        if (oLayerEpsg.isPresent()) {
            return oLayerEpsg.get();
        }

        List<FeatureObject> objects = featureData.getObjects();
        if (objects == null || objects.isEmpty()) {
            return null;
        }

        Optional<FeatureProperty> shapeOpt = objects
                .get(0)
                .getProperties()
                .stream()
                .filter(property -> DEFAULT_GEOMETRY_COLUMN_NAME.equalsIgnoreCase(property.getName()))
                .findFirst();
        if (shapeOpt.isEmpty()) {
            return null;
        }

        PGgeometry geometry = (PGgeometry) shapeOpt.get().getValue();
        int srid = geometry.getGeometry().getSrid();

        return (srid != 0) ? "EPSG:" + srid : null;
    }

    private Optional<String> getEpsgForLayer(List<SimpleFeatureData> features, SchemaDto schema) {
        return features.stream()
                       .filter(tableDto -> schema.getName().toLowerCase()
                                                 .startsWith(tableDto.getSchemaName().toLowerCase()))
                       .findFirst()
                       .map(SimpleFeatureData::getEpsgCode);
    }

    private ImportLayerReport importLayer(FeatureData featureData,
                                          String epsgCode,
                                          SchemaDto schema,
                                          String datasetIdentifier) {
        ImportLayerReport importLayerReport = new ImportLayerReport(schema.getName(), epsgCode);

        try {
            TableCreateDto table = new TableCreateDto(schema.getTitle());
            table.setName(schema.getName() + "_" + RandomString.make(6).toLowerCase());
            table.setSchemaId(schema.getName());
            table.setCrs(epsgCode);

            if (schema.getCalcFiledFunction() != null) {
                calculateFieldsByCustomRules(featureData, schema.getCalcFiledFunction());
            }

            Map<String, String> propsWithFunctions = getPropertiesWithCalculatedFunctions(schema);
            propsWithFunctions.forEach((key, formula) -> {
                calculatePropertiesByFormula(featureData, key, formula);
            });

            if (!featureData.getObjects().isEmpty()) {
                ResourceQualifier tableQualifier = new ResourceQualifier(datasetIdentifier, table.getName());

                mediator.execute(new CreateTableRequest(table, tableQualifier));

                int countOfAddedRecords = addRecordsToTable(tableQualifier, featureData, schema);

                geometryDao.makeValid(tableQualifier.getSchema(), tableQualifier.getTable());

                if (countOfAddedRecords > 0) {
                    runValidation(datasetIdentifier, table.getName());
                }

                importLayerReport.setSuccess(true);
                importLayerReport.setTableIdentifier(table.getName());
                importLayerReport.setSuccessCount(countOfAddedRecords);
                importLayerReport.setTableTitle(schema.getTitle());
            } else {
                importLayerReport.setSuccess(true);
                importLayerReport.setTableIdentifier(table.getName());
                importLayerReport.setSuccessCount(0);
                importLayerReport.setTableTitle(schema.getTitle());
            }
        } catch (CrgDaoException e) {
            String msg = "Ошибка при добавлении записи в таблицу " + schema.getTitle() + ". " + e.getMessage();
            log.error(msg, e.getCause());

            importLayerReport.setSuccess(false);
            importLayerReport.setReason(msg);
        } catch (BadRequestException e) {
            String msg = String.format("Не удалось создать таблицу для слоя: %s", schema.getTitle());
            log.error(msg, e.getCause());

            importLayerReport.setSuccess(false);
            importLayerReport.setReason(msg);
        } catch (Exception e) {
            String msg = String.format("Не удалось выполнить импорт слоя: '%s', по причине: %s",
                                       schema.getTitle(), e.getMessage());
            log.error(msg, e.getCause());

            importLayerReport.setSuccess(false);
            importLayerReport.setReason(msg);
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
                    log.warn("Не найдена схемы для таблицы: '{}'", schemaName);

                    String msg = String.format("Название таблицы: '%s' не соответствует предусмотренному " +
                                                       "приказом №10 Минэкономразвития России", schemaName);

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

    private int addRecordsToTable(ResourceQualifier tableQualifier,
                                  FeatureData propertiesBySchema,
                                  SchemaDto schema) throws CrgDaoException {
        List<FeatureObject> objects = propertiesBySchema.getObjects();

        Map<String, Object>[] objectList = preparePropsToDB(objects);

        recordsDao.addRecordsAsBatch(tableQualifier, objectList, schema);

        return objectList.length;
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

    private void runValidation(String datasetIdentifier, String tableName) {
        ExportResourceModel resourceModel = new ExportResourceModel();
        resourceModel.setDataset(datasetIdentifier);
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

            var calculatedFields = (Map<String, Object>) crgScriptEngine.invokeFunction(props, calcFieldFunction);
            calculatedFields.forEach((key, value) -> {
                properties.add(new FeatureProperty(key, value, STRING));
            });
        });
    }

    private void calculatePropertiesByFormula(FeatureData featureData,
                                              String fieldName,
                                              String calcFieldFunction) {
        featureData.getObjects().forEach(featureObject -> {
            Map<String, Object> props = new HashMap<>();
            final List<FeatureProperty> properties = featureObject.getProperties();
            long fieldNameCount = properties.stream()
                                            .filter(property -> property.getName().equalsIgnoreCase(fieldName))
                                            .count();
            if (fieldNameCount > 0) {
                properties.forEach(featureProperty -> props.put(featureProperty.getName(),
                                                                featureProperty.getValue()));

                String result = crgScriptEngine.invokeFunctionAsString(props, calcFieldFunction);

                properties.add(new FeatureProperty(fieldName, result, STRING));
            }
        });
    }
}
