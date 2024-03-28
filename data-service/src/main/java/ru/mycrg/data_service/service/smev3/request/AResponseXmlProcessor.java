package ru.mycrg.data_service.service.smev3.request;

import ru.mycrg.data_service.receipt_rns_1_0_9.FileType;
import ru.mycrg.data_service.service.smev3.model.ResponseAttachment;
import ru.mycrg.data_service.util.xml.XmlMapper;

import javax.xml.datatype.XMLGregorianCalendar;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static java.util.Optional.ofNullable;

public abstract class AResponseXmlProcessor {

    protected Optional<ResponseAttachment> asFileType(List<FileType> value) {
        return ofNullable(value)
                .flatMap(files -> files.stream().findFirst())
                .map(fileType -> new ResponseAttachment(fileType.getName(),
                                                        fileType.getAttachmentRef().getAttachmentId()));
    }

    protected Optional<String> asString(String value) {
        return ofNullable(value);
    }

    protected Optional<Long> asLong(Long value) {
        return ofNullable(value);
    }

    protected Optional<BigInteger> asBigInteger(BigInteger value) {
        return ofNullable(value);
    }

    protected Optional<Integer> asInt(Integer value) {
        return ofNullable(value);
    }

    protected Optional<LocalDateTime> asLocalDateTime(XMLGregorianCalendar xmlGregorianCalendar) {
        return ofNullable(xmlGregorianCalendar).map(XmlMapper::mapLocalDateTime);
    }

    protected Optional<Boolean> asBoolean(Boolean value) {
        return ofNullable(value);
    }
}
