package ru.mycrg.data_service.util.filter;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;

public class CrgFilter {

    private List<FilterItem> filterItems = new ArrayList<>();

    public CrgFilter() {
        // Required
    }

    public CrgFilter(@NotNull String field,
                     @NotNull String value,
                     @NotNull FilterCondition condition) {
        this.filterItems.add(new FilterItem(field, value, condition));
    }

    public void attach(CrgFilter crgFilter) {
        this.filterItems.addAll(crgFilter.getFilters());
    }

    public void addFilter(@NotNull String field,
                          @NotNull String value,
                          @NotNull FilterCondition condition) {
        this.filterItems.add(new FilterItem(field, value, condition));
    }

    public List<FilterItem> getFilters() {
        return this.filterItems;
    }

    public boolean isNotEmpty() {
        return !this.filterItems.isEmpty();
    }
}
