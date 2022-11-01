package ru.mycrg.wrapper.service.export;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class GmlDocumentHolder {

    private final Document gmlDocument;
    private final Element gmlFeatureCollection;
    private final Element objectCollection;
    private final Element specialZoneCollection;

    public GmlDocumentHolder(Document mainDoc,
                             Element gmlFeatureCollection,
                             Element objectCollection,
                             Element specialZoneCollection) {
        this.gmlDocument = mainDoc;
        this.gmlFeatureCollection = gmlFeatureCollection;
        this.objectCollection = objectCollection;
        this.specialZoneCollection = specialZoneCollection;
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

    public Element getSpecialZoneCollection() {
        return specialZoneCollection;
    }
}
