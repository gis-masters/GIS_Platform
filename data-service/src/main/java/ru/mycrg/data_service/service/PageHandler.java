package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

public class PageHandler {

    @NotNull
    public static PageImpl<?> getPageableResource(List<?> resources, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), resources.size());
        if (start > end) {
            return new PageImpl<>(new ArrayList<>(), pageable, resources.size());
        } else {
            return new PageImpl<>(resources.subList(start, end), pageable, resources.size());
        }
    }

}
