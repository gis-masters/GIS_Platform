package ru.mycrg.wrapper.service.gml;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class GmlDocumentHolder {

    private Document gmlDocument;
    private Document logDocument;
    private Element gmlFeatureCollection;
    private Element objectCollection;
    private Element logRootNode;

    public GmlDocumentHolder(Document mainDoc, Document logDoc, Element gmlFeatureCollection,
                             Element objectCollection, Element logRootNode) {
        this.gmlDocument = mainDoc;
        this.logDocument = logDoc;
        this.gmlFeatureCollection = gmlFeatureCollection;
        this.logRootNode = logRootNode;
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

    public Document getLogDocument() {
        return logDocument;
    }

    public void setLogDocument(Document logDocument) {
        this.logDocument = logDocument;
    }

    public Element getLogRootNode() {
        return logRootNode;
    }
}
