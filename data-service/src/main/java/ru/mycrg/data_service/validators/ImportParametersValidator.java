package ru.mycrg.data_service.validators;

import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.import_.model.GmlInfo;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static org.springframework.util.StringUtils.isEmpty;

public class ImportParametersValidator {

    private ImportParametersValidator() {
        throw new IllegalStateException("Utility class");
    }

    public static void throwIfNotValid(GmlInfo doc, MultipartFile file) {
        String filename = file.getOriginalFilename();
        String fileExtension = FilenameUtils.getExtension(filename);
        String errorEmpty = "не может быть пустым";
        String errorLong = "слишком длинное";

        if (file.isEmpty()) {
            throw new BadRequestException("Загружаемый файл пустой", new ErrorInfo("gmlFile", errorEmpty));
        } else if (isEmpty(fileExtension) || !"gml".equalsIgnoreCase(fileExtension)) {
            throw new BadRequestException("Тип файла не GML", new ErrorInfo("gmlFile", "Тип файла не GML"));
        }

        if (doc.getOktmo().isBlank()) {
            throw new BadRequestException("Поле oktmo не  должно быть пустым", new ErrorInfo("oktmo", errorEmpty));
        }

        if (doc.getOktmo().length() > 50) {
            throw new BadRequestException("Поле oktmo не должно превышать 50 символов",
                                          new ErrorInfo("oktmo", errorLong));
        }

        if (doc.getDocumentType().isBlank()) {
            throw new BadRequestException("Поле documentType не  должно быть пустым",
                                          new ErrorInfo("documentType", errorEmpty));
        }

        if (doc.getDocumentType().length() > 100) {
            throw new BadRequestException("Поле documentType не должно превышать 100 символов",
                                          new ErrorInfo("documentType", errorLong));
        }

        if (doc.getTitle().isBlank()) {
            throw new BadRequestException("Поле title не  должно быть пустым",
                                          new ErrorInfo("title", errorEmpty));
        }

        if (doc.getTitle().length() > 250) {
            throw new BadRequestException("Поле title не должно превышать 250 символов",
                                          new ErrorInfo("title", errorLong));
        }

        if (isNull(doc.getScale())) {
            throw new BadRequestException("Поле scale не  должно быть пустым",
                                          new ErrorInfo("scale", errorEmpty));
        }

        if (nonNull(doc.getDetails()) && doc.getDetails().length() > 1000) {
            throw new BadRequestException("Поле details не должно превышать 1000 символов",
                                          new ErrorInfo("details", errorLong));
        }

        try {
            LocalDate.parse(doc.getDocDateApprove());
        } catch (DateTimeParseException e) {
            throw new BadRequestException("Поле docDateApprove должно быть в формате: YYYY-MM-DD",
                                          new ErrorInfo("docDateApprove", "не валидный формат даты"));
        }
    }
}
