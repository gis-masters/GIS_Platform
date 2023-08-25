package ru.crg.gisogd_service.exception;

import ru.mycrg.gisog_service_contract.dto.Document;

/**
 * Document type resolve exception.
 * @author Vladimir Nomokonov
 */
public class DocumentTypeResolveException extends RuntimeException {

    private static final String MESSAGE = "Document type could not be determined for document name: %s";

    public DocumentTypeResolveException(Document document) {
        super(String.format(MESSAGE, document.getName()));
    }
}
