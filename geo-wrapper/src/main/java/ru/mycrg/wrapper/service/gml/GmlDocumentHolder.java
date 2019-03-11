package ru.mycrg.wrapper.service.gml;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class GmlDocumentHolder {

    private Document document;
    private Element featureCollection;
    private Element objectCollection;

    public GmlDocumentHolder(Document doc, Element featureCollection, Element objectCollection) {
        this.document = doc;
        this.featureCollection = featureCollection;
        this.objectCollection = objectCollection;
    }

    public Document getDocument() {
        return document;
    }

    public Element getFeatureCollection() {
        return featureCollection;
    }

    public Element getObjectCollection() {
        return objectCollection;
    }
}
