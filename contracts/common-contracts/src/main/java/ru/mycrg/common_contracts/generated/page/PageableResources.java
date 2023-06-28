package ru.mycrg.common_contracts.generated.page;

import java.util.List;

public class PageableResources<T> {

    private List<T> content;
    private Page page;

    public PageableResources(List<T> content, Page page) {
        this.content = content;
        this.page = page;
    }

    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }

    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }
}
