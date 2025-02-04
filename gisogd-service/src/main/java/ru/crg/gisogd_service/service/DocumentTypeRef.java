package ru.crg.gisogd_service.service;

import lombok.Value;

/**
 * Document type reference by name, contentType fields.
 * @author Vladimir Nomokonov
 */
@Value
public class DocumentTypeRef {

    String name;
    String contentType;

    public DocumentTypeRef(String nameStartWith, String contentType) {
        this.name = nameStartWith;
        this.contentType = contentType;
    }
}
