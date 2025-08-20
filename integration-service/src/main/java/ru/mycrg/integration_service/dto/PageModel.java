package ru.mycrg.integration_service.dto;

import java.io.Serializable;

public class PageModel<T> implements Serializable {

    private T content;
    private Page page;

    public PageModel() {
        // Required
    }

    public T getContent() {
        return content;
    }

    public void setContent(T content) {
        this.content = content;
    }

    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }
}
