package ru.mycrg.gateway.filters;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

import java.util.Collections;
import java.util.Enumeration;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeMap;

public class MutableHttpServletRequest extends HttpServletRequestWrapper {

    private final TreeMap<String, List<String>> customHeaders = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);

    public MutableHttpServletRequest(HttpServletRequest request) {
        super(request);
    }

    public void putHeader(String name, String value) {
        customHeaders.put(name, List.of(value));
    }

    @Override
    public String getHeader(String name) {
        List<String> values = customHeaders.get(name);
        if (values != null && !values.isEmpty()) {
            return values.get(0);
        }

        return super.getHeader(name);
    }

    @Override
    public Enumeration<String> getHeaders(String name) {
        List<String> values = customHeaders.get(name);
        if (values != null) {
            return Collections.enumeration(values);
        }

        return super.getHeaders(name);
    }

    @Override
    public Enumeration<String> getHeaderNames() {
        Set<String> headerNames = new LinkedHashSet<>();
        Enumeration<String> originalHeaderNames = super.getHeaderNames();
        while (originalHeaderNames.hasMoreElements()) {
            headerNames.add(originalHeaderNames.nextElement());
        }
        headerNames.addAll(customHeaders.keySet());

        return Collections.enumeration(headerNames);
    }
}
