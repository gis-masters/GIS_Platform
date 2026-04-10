package ru.mycrg.report_service.utils;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class ImagesUtils {

    private final Logger log = LoggerFactory.getLogger(ImagesUtils.class);

    /**
     * Определяет тип изображения по байтовой сигнатуре.
     *
     * @param imageBytes массив байтов изображения
     *
     * @return константа типа изображения из XWPFDocument (PICTURE_TYPE_PNG, PICTURE_TYPE_JPEG) или -1 если формат не поддерживается
     */
    public int detectImageType(byte[] imageBytes) {
        if (imageBytes == null || imageBytes.length == 0) {
            log.error("Пустой массив байтов изображения");

            return -1;
        }

        // PNG: полная сигнатура 89 50 4E 47 0D 0A 1A 0A (8 байт)
        if (imageBytes.length >= 8 &&
                (imageBytes[0] & 0xFF) == 0x89 &&
                (imageBytes[1] & 0xFF) == 0x50 &&
                (imageBytes[2] & 0xFF) == 0x4E &&
                (imageBytes[3] & 0xFF) == 0x47 &&
                (imageBytes[4] & 0xFF) == 0x0D &&
                (imageBytes[5] & 0xFF) == 0x0A &&
                (imageBytes[6] & 0xFF) == 0x1A &&
                (imageBytes[7] & 0xFF) == 0x0A) {
            log.debug("Обнаружен формат изображения: PNG");

            return XWPFDocument.PICTURE_TYPE_PNG;
        }

        // JPEG: начинается с FF D8 FF
        if (imageBytes.length >= 3 &&
                (imageBytes[0] & 0xFF) == 0xFF &&
                (imageBytes[1] & 0xFF) == 0xD8 &&
                (imageBytes[2] & 0xFF) == 0xFF) {
            log.debug("Обнаружен формат изображения: JPEG");

            return XWPFDocument.PICTURE_TYPE_JPEG;
        }

        // Неподдерживаемый формат
        log.error("Неподдерживаемый формат изображения. Первые байты: {} {} {} {}",
                  String.format("%02X", imageBytes[0] & 0xFF),
                  imageBytes.length > 1 ? String.format("%02X", imageBytes[1] & 0xFF) : "N/A",
                  imageBytes.length > 2 ? String.format("%02X", imageBytes[2] & 0xFF) : "N/A",
                  imageBytes.length > 3 ? String.format("%02X", imageBytes[3] & 0xFF) : "N/A");

        return -1;
    }

    /**
     * Декодирует изображение из Base64 строки в массив байтов.
     *
     * @param base64Picture Base64 строка изображения (может содержать префикс data:image)
     *
     * @return массив байтов декодированного изображения
     *
     * @throws IllegalArgumentException если строка null или пустая
     */
    public byte[] decodePicture(String base64Picture) {
        if (base64Picture == null || base64Picture.isEmpty()) {
            log.error("Base64 строка изображения не может быть null или пустой");

            throw new IllegalArgumentException("Base64 строка изображения не может быть null или пустой");
        }

        String base64Data = base64Picture;

        if (base64Picture.contains(",")) {
            base64Data = base64Picture.substring(base64Picture.indexOf(",") + 1);
        }

        return Base64.getDecoder().decode(base64Data);
    }
}
