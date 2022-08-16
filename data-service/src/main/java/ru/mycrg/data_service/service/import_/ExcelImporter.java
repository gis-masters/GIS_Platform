package ru.mycrg.data_service.service.import_;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.parsers.ExcelParser;
import ru.mycrg.data_service.service.import_.dto.ImportInitializingModel;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.ImportRecordReport;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static java.util.Objects.isNull;
import static ru.mycrg.data_service.service.import_.ImportType.EXCEL;
import static ru.mycrg.data_service_contract.enums.ValueType.*;

@Service
public class ExcelImporter implements Importer<List<ImportRecordReport>> {

    private final ExcelParser excelParser;
    private final RecordsDao recordsDao;
    private final DocumentLibraryService libraryService;
    private final PermissionsService permissionsService;

    public ExcelImporter(ExcelParser excelParser,
                         RecordsDao recordsDao,
                         DocumentLibraryService libraryService,
                         PermissionsService permissionsService) {
        this.excelParser = excelParser;
        this.recordsDao = recordsDao;
        this.libraryService = libraryService;
        this.permissionsService = permissionsService;
    }

    @Override
    public ImportType getType() {
        return EXCEL;
    }

    @Override
    public Importer<List<ImportRecordReport>> validate() {
        return null;
    }

    @Override
    public Importer<List<ImportRecordReport>> setPayload(ImportInitializingModel importInitialData, IRecord record) {
        return null;
    }

    @Override
    public List<ImportRecordReport> doImport(MultipartFile excelFile, ResourceQualifier lQualifier) {
        List<ImportRecordReport> result = new ArrayList<>();
        String docLibId = lQualifier.getTable();

        SchemaDto schema = libraryService.getSchema(docLibId);

        List<Map<String, Object>> dataForSavingToDB = excelParser.parse(excelFile, schema);
        fillRequiredProperties(dataForSavingToDB);
        dataForSavingToDB.forEach(properties -> {
            ImportRecordReport report = new ImportRecordReport();
            report.setLibraryId(docLibId);
            try {
                convertPropsToNecessaryType(properties, schema.getProperties());
                IRecord newRecord = recordsDao.addRecord(lQualifier, new RecordEntity(properties), schema);
                report.setSuccess(true);
                permissionsService.addOwnerPermission(lQualifier, newRecord.getId());
            } catch (CrgDaoException e) {
                report.setSuccess(false);
                report.setReason(e.getMessage());
            }
            result.add(report);
        });

        return result;
    }

    private void fillRequiredProperties(List<Map<String, Object>> records) {
        records.forEach(record -> {
            record.put("title", "test");
            record.put("content_type_id", "test content type");
            record.put("path", "/root");
            record.put("is_folder", false);
            record.put("created_at", new Date());
        });
    }

    private void convertPropsToNecessaryType(Map<String, Object> record, List<SimplePropertyDto> properties) {
        for (SimplePropertyDto property: properties) {
            String propName = property.getName();

            if (record.containsKey(propName)) {
                Object value = record.get(propName);

                if (BOOLEAN.equals(property.getValueType())) {
                    booleanConversion(record, propName);
                } else if (isNull(value)) {
                    record.put(propName, null);
                } else if (INT.equals(property.getValueType())) {
                    int intValue = Integer.parseInt(value.toString());
                    record.put(propName, intValue);
                } else if (DOUBLE.equals(property.getValueType())) {
                    double doubleValue = Double.parseDouble(value.toString());
                    record.put(propName, doubleValue);
                } else if (!STRING.equals(property.getValueType()) && !TEXT.equals(property.getValueType())
                        && value.equals("")) {
                    record.put(propName, null);
                }
            }
        }
    }

    private Map<String, Object> booleanConversion(Map<String, Object> record, String propName) {
        Object value = record.get(propName);
        if (isNull(value)) {
            record.put(propName, false);

            return record;
        }
        String strValue = value.toString();
        if (strValue.isEmpty()
                || "false".equalsIgnoreCase(strValue)
                || "0".equals(strValue)
                || "нет".equalsIgnoreCase(strValue)) {
            record.put(propName, false);
        } else {
            record.put(propName, true);
        }

        return record;
    }
}
