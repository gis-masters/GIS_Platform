package ru.crg.gisogd_service.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.reflections.Reflections;
import org.reflections.util.ConfigurationBuilder;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.exception.DocumentTypeResolveException;
import ru.crg.gisogd_service.model.rf.RfGuid;
import ru.mycrg.gisog_service_contract.dto.Document;

/**
 * Document type resolver.
 * @author Vladimir Nomokonov
 */
@Slf4j
@Component("documentTypeResolver")
@AllArgsConstructor
public class DocumentTypeResolver {

    public static final String PACKAGE_FOR_SCAN = "ru.crg.gisogd_service.converter.mixin";
    private static final String BAD_CLASSES_MESSAGE = "The following classes do not have a nameStartWith relationship defined: %s";
    private final Map<DocumentTypeRef, Pair<Class<? extends RfGuid>, Class<?>>> rfObjectTypes = new HashMap<>();
    private final Map<Class<?>, String> gisogdEndpoints = new HashMap<>();

    /**
     * Returns {@link Class RF object type}.
     * @param document document
     * @return {@link Class RF object type}
     */
    public <T extends RfGuid> Class<T> getRfObjectType(Document document) {
        Pair<Class<? extends RfGuid>, Class<?>> rfObjectType = rfObjectTypes.get(getDocumentTypeRef(document));
        if (rfObjectType == null) {
            throw new DocumentTypeResolveException(document);
        }

        return (Class<T>) rfObjectType.getLeft();
    }

    /**
     * Returns {@link Class RF mixin}.
     * @param document document
     * @return {@link Class RF mixin}
     */
    public <T extends RfGuid> Class<T> getRfObjectTypeMixin(Document document) {
        Pair<Class<? extends RfGuid>, Class<?>> rfObjectType = rfObjectTypes.get(getDocumentTypeRef(document));
        if (rfObjectType == null) {
            throw new DocumentTypeResolveException(document);
        }

        return (Class<T>) rfObjectType.getRight();
    }

    /**
     * Get endpoint path gisogd api
     * @param oClass gisogd object type
     * @return endpoint path
     */
    public String getEndpointByType(Class<?> oClass) {

        return Optional.ofNullable(gisogdEndpoints.get(oClass))
                       .orElse(oClass.getSimpleName());
    }

    @PostConstruct
    private void init() {
        List<Class<?>> badClasses = new ArrayList<>();
        Reflections scanner = new Reflections(new ConfigurationBuilder().forPackages(PACKAGE_FOR_SCAN));
        Set<Class<?>> crimeaClasses = scanner.getTypesAnnotatedWith(CrimeaRelationResolve.class);
        crimeaClasses.forEach(aClass -> {
            CrimeaRelationResolve resolveProps = aClass.getAnnotation(CrimeaRelationResolve.class);
            if (resolveProps != null && !resolveProps.exclude()) {
                if (StringUtils.isNotBlank(resolveProps.nameStartWith())) {
                    rfObjectTypes.put(new DocumentTypeRef(resolveProps.nameStartWith(), resolveProps.contentType()),
                                      Pair.of(resolveProps.objectClass(), aClass));
                } else {
                    badClasses.add(aClass);
                }
                gisogdEndpoints.put(resolveProps.objectClass(),
                                    StringUtils.isNotBlank(resolveProps.endpoint()) ? resolveProps.endpoint()
                                                                                    : resolveProps.objectClass().getSimpleName());
            }
        });
        log.info("Found GISOGD mixins handlers: " + rfObjectTypes.size());
        if (!badClasses.isEmpty()) {
            String classesName = badClasses.stream()
                                           .map(Class::getSimpleName)
                                           .collect(Collectors.joining(", "));
            throw new RuntimeException(String.format(BAD_CLASSES_MESSAGE, classesName));
        }
    }

    private DocumentTypeRef getDocumentTypeRef(Document document) {
        String name = document.getName();
        List<DocumentTypeRef> refsList = rfObjectTypes.keySet()
                                                      .stream()
                                                      .filter(ref -> name.startsWith(ref.getName()))
                                                      .collect(Collectors.toList());
        if (refsList.isEmpty()) {
            throw new DocumentTypeResolveException(document);
        }

        if (refsList.size() == 1) {
            return refsList.get(0);
        }
        return refsList
                .stream()
                .filter(ref -> name.equals(ref.getName()))
                .findFirst()
                .orElseThrow(() -> new DocumentTypeResolveException(document));
    }
}
