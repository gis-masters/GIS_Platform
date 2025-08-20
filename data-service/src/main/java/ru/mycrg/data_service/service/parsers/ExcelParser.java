package ru.mycrg.data_service.service.parsers;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Objects.nonNull;

@Service
public class ExcelParser {

    private final Logger log = LoggerFactory.getLogger(ExcelParser.class);

    public List<Map<String, Object>> parse(MultipartFile excelFile, SchemaDto schemaDto) {
        try {
            XSSFWorkbook myExcelBook = new XSSFWorkbook(excelFile.getInputStream());

            String sheetName = myExcelBook.getSheetName(0);
            XSSFSheet firstSheet = myExcelBook.getSheet(sheetName);
            checkIsSheetBlank(firstSheet);
            List<String> columnNames = getColumnNamesFromSheet(firstSheet);

            myExcelBook.close();

            return getPropertiesByScheme(firstSheet, columnNames, schemaDto.getProperties());
        } catch (IOException e) {
            throw new DataServiceException(e.getMessage());
        }
    }

    private List<String> getColumnNamesFromSheet(XSSFSheet firstSheet) {
        List<String> columnNames = new ArrayList<>();
        XSSFRow row = firstSheet.getRow(0);

        row.forEach(cell -> {
            if (cell.getCellType() == CellType.STRING) {
                columnNames.add(cell.getStringCellValue().toLowerCase());
            }
        });

        return columnNames;
    }

    private List<Map<String, Object>> getPropertiesByScheme(XSSFSheet firstSheet, List<String> columnNames,
                                                            List<SimplePropertyDto> simpleProperties) {
        List<Map<String, Object>> props = new ArrayList<>();
        int quantityOfRows = firstSheet.getPhysicalNumberOfRows();
        List<String> fieldNames = new ArrayList<>();
        simpleProperties.forEach(field -> fieldNames.add(field.getName().toLowerCase()));

        for (int i = 1; i < quantityOfRows; i++) {
            Map<String, Object> result = new HashMap<>();
            XSSFRow row = firstSheet.getRow(i);
            if (nonNull(row)) {
                for (int j = 0; j < columnNames.size(); j++) {
                    String currentColumnName = columnNames.get(j);
                    if (fieldNames.contains(currentColumnName)) {
                        getPropertyFromCell(row.getCell(j), result, currentColumnName);
                    }
                }
                props.add(result);
            }
        }

        return props;
    }

    private void getPropertyFromCell(Cell cell, Map<String, Object> result, String columnName) {
        if (cell.getCellType() == CellType.STRING) {
            result.put(columnName, cell.getStringCellValue());
        } else if (cell.getCellType() == CellType.NUMERIC) {
            if (!cell.getCellStyle().getDataFormatString().equals("@")) {
                result.put(columnName, cell.getDateCellValue());
            } else {
                result.put(columnName, cell.getNumericCellValue());
            }
        } else if (cell.getCellType() == CellType.BOOLEAN) {
            result.put(columnName, cell.getBooleanCellValue());
        } else if (cell.getCellType() == CellType.BLANK) {
            result.put(columnName, "");
        }
    }

    private void checkIsSheetBlank(XSSFSheet sheet) {
        if (sheet.getPhysicalNumberOfRows() == 0) {
            String msg = "Загружаемый файл пустой";
            log.warn(msg);

            throw new BadRequestException(msg);
        }
    }
}
