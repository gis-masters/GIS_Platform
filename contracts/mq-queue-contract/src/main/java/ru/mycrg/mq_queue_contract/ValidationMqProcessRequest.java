package ru.mycrg.mq_queue_contract;

import java.util.ArrayList;
import java.util.List;

public class ValidationMqProcessRequest {

    private int page;
    private int size;
    private final List<ResourceProjection> resourceProjections = new ArrayList<>();

    public ValidationMqProcessRequest() {
        this.page = 0;
        this.size = 25;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public List<ResourceProjection> getResourceProjections() {
        return resourceProjections;
    }

    public void addResourceProjections(ResourceProjection resourceProjection) {
        this.resourceProjections.add(resourceProjection);
    }
}
