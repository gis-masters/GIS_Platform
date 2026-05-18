package ru.mycrg.report_service.dto;

import org.springframework.core.io.Resource;

public record TemplateFileInfo(String name, Resource resource, long contentLength) {
}
