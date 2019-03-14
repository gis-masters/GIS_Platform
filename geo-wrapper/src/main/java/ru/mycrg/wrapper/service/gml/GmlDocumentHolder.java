package ru.mycrg.wrapper.service.gml;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class GmlDocumentHolder {

    private Document gmlDocument;
    private Document logDocument;
    private Element featureCollection;
    private Element objectCollection;

    public GmlDocumentHolder(Document mainDoc, Document logDoc, Element featureCollection, Element objectCollection) {
        this.gmlDocument = mainDoc;
        this.logDocument = logDoc;
        this.featureCollection = featureCollection;
        this.objectCollection = objectCollection;
    }

    public Document getGmlDocument() {
        return gmlDocument;
    }

    public Element getFeatureCollection() {
        return featureCollection;
    }

    public Element getObjectCollection() {
        return objectCollection;
    }

    public Document getLogDocument() {
        return logDocument;
    }

    public void setLogDocument(Document logDocument) {
        this.logDocument = logDocument;
    }
}
