package ru.mycrg.common_utils;

import org.jetbrains.annotations.NotNull;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

/**
 * Support for any lists which we want pagination using {@link Pageable}.
 */
public class Paginator {

    public Paginator() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Constructs a {@link Page} based on the given {@code elements} and {@link Pageable} information
     *
     * @param elements must not be {@literal null}.
     * @param pageable must not be {@literal null}.
     *
     * @return the {@link Page}.
     */
    public static <T> Page<T> getPage(@NotNull List<T> elements, @NotNull Pageable pageable) {
        PagedListHolder<T> page = new PagedListHolder<>(elements);
        page.setPageSize(pageable.getPageSize());

        if (pageable.getPageNumber() >= page.getPageCount()) {
            return new PageImpl<>(new ArrayList<>(), pageable, elements.size());
        } else {
            page.setPage(pageable.getPageNumber());

            return new PageImpl<>(page.getPageList(), pageable, elements.size());
        }
    }
}
