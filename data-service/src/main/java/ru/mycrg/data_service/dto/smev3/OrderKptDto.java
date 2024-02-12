package ru.mycrg.data_service.dto.smev3;

import java.util.List;

public class OrderKptDto {

    private List<String> order;

    public List<String> getOrder() {
        return order;
    }

    public OrderKptDto setOrder(List<String> order) {
        this.order = order;
        return this;
    }
}
