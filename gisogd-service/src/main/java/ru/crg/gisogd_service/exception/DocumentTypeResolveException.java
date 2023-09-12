package ru.crg.gisogd_service.exception;

import ru.mycrg.gisog_service_contract.dto.Document;

/**
 * Document type resolve exception.
 * @author Vladimir Nomokonov
 */
public class DocumentTypeResolveException extends RuntimeException {

    private static final String DOCUMENT_TYPE_RESOVE_EXCEPTION = "Document type could not be determined for document name: %s";
    private static final String DOC_LIB_ID_RESOLVE_EXCEPTION = "DocLibId could not be determined for class name: %s";

    public DocumentTypeResolveException(Document document) {
        super(String.format(DOCUMENT_TYPE_RESOVE_EXCEPTION, document.getName()));
    }

    public DocumentTypeResolveException(String className) {
        super(String.format(DOC_LIB_ID_RESOLVE_EXCEPTION, className));
    }
}
