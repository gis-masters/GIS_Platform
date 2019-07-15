package ru.mycrg.wrapper.service.export;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class GmlDocumentHolder {

    private Document gmlDocument;
    private Element gmlFeatureCollection;
    private Element objectCollection;

    public GmlDocumentHolder(Document mainDoc, Element gmlFeatureCollection, Element objectCollection) {
        this.gmlDocument = mainDoc;
        this.gmlFeatureCollection = gmlFeatureCollection;
        this.objectCollection = objectCollection;
    }

    public Document getGmlDocument() {
        return gmlDocument;
    }

    public Element getGmlFeatureCollection() {
        return gmlFeatureCollection;
    }

    public Element getObjectCollection() {
        return objectCollection;
    }

}
