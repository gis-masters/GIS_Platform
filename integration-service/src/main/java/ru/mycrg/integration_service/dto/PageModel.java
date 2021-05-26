package ru.mycrg.integration_service.dto;

import java.io.Serializable;

public class PageModel<T> implements Serializable {

    private T _embedded;
    private Object _links;
    private Page page;

    public PageModel() {
        // Required
    }

    public T getEmbedded() {
        return _embedded;
    }

    public void setEmbedded(T embedded) {
        this._embedded = embedded;
    }

    public Object getLinks() {
        return _links;
    }

    public void setLinks(Object links) {
        this._links = links;
    }

    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }
}
