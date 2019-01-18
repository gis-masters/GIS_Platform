package ru.mycrg.gis.service.fgistp;

import org.apache.xerces.dom.DeferredElementImpl;
import org.apache.xerces.impl.dv.xs.XSSimpleTypeDecl;
import org.apache.xerces.impl.xs.*;
import org.apache.xerces.xs.*;
import org.apache.xerces.xs.datatypes.XSDecimal;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.bootstrap.DOMImplementationRegistry;
import org.xml.sax.SAXException;
import ru.mycrg.gis.dto.fgistp.EntityType;
import ru.mycrg.gis.dto.fgistp.FgistpRules;
import ru.mycrg.gis.dto.fgistp.XsdSimpleType;
import ru.mycrg.gis.dto.fgistp.types.*;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.apache.xerces.impl.xs.XSParticleDecl.PARTICLE_ELEMENT;
import static org.apache.xerces.impl.xs.XSParticleDecl.PARTICLE_MODELGROUP;
import static org.apache.xerces.xs.XSConstants.ELEMENT_DECLARATION;
import static org.apache.xerces.xs.XSSimpleTypeDefinition.*;
import static ru.mycrg.gis.service.fgistp.EntityTypeUtil.*;

@Service
public class ClassDefinitionParser {

    private static Logger log = LoggerFactory.getLogger(ClassDefinitionParser.class);

    private String TARGET_NAMESPACE = "http://fgistp";

    public FgistpRules parse(@NotNull File file) {
        FgistpRules fgistpRules = new FgistpRules();

        try {
            // Get DOM Implementation using DOM Registry
            System.setProperty(DOMImplementationRegistry.PROPERTY, "org.apache.xerces.dom.DOMXSImplementationSourceImpl");
            DOMImplementationRegistry registry = DOMImplementationRegistry.newInstance();

            XSImplementation impl = (XSImplementation) registry.getDOMImplementation("XS-Loader");
            XSLoader schemaLoader = impl.createXSLoader(null);
            XSModel xsModel = schemaLoader.loadURI(file.toURI().toString());

            SchemaGrammar fgistpGrammar = getFgistpGrammar(xsModel)
                    .orElseThrow(() -> new FgistpGrammarException("Not found grammar: " + TARGET_NAMESPACE));

            parseComplexTypes(fgistpRules, fgistpGrammar);

            addEnumerationAlias(fgistpRules, fetchEnumerationsAliasesFromXsdSimpleTypes(file));
            fillDescription(fgistpRules.getEntityTypes());
            joinGeometry(fgistpRules.getEntityTypes());
            addDbTableName(fgistpRules.getEntityTypes());
        } catch (ClassNotFoundException | IllegalAccessException | InstantiationException |
                ParserConfigurationException | IOException | SAXException e) {
            log.error("Error parse file: " + file.getName(), e);
        }

        return fgistpRules;
    }

    public List<XsdSimpleType> fetchEnumerationsAliasesFromXsdSimpleTypes(File file)
            throws ParserConfigurationException, IOException, SAXException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(file);
        NodeList nodeList = document.getDocumentElement().getChildNodes();

        return getSimpleNodes(nodeList);
    }

    private List<XsdSimpleType> getSimpleNodes(NodeList nodeList) {
        List<XsdSimpleType> simpleTypes = new ArrayList<>();

        for (int i = 0; i < nodeList.getLength(); i++) {
            Node node = nodeList.item(i);
            if (node.getNodeType() == Node.ELEMENT_NODE && "xs:simpleType".equals(node.getNodeName())) {
                XsdSimpleType simpleType = new XsdSimpleType();

                String nodeName = ((DeferredElementImpl) node).getAttribute("name");
                simpleType.setName(nodeName);

                Node restrictionNode = getRestrictionNode(node.getChildNodes());
                fetchEnumerations(restrictionNode.getChildNodes(), simpleType.getProperties());

                if (!simpleType.getProperties().isEmpty()) {
                    simpleTypes.add(simpleType);
                }
            }
        }

        return simpleTypes;
    }

    private void fetchEnumerations(NodeList nodes, Map<String, String> properties) {
        for (int i = 0; i < nodes.getLength(); i++) {
            Node node = nodes.item(i);
            if (node.getNodeType() == Node.ELEMENT_NODE && "xs:enumeration".equals(node.getNodeName())) {
                String alias = ((DeferredElementImpl) node).getAttribute("fgistp:username");
                String value = ((DeferredElementImpl) node).getAttribute("value");

                properties.put(value, alias);
            }
        }
    }

    private Node getRestrictionNode(NodeList nodeList) {
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node node = nodeList.item(i);
            if (node.getNodeType() == Node.ELEMENT_NODE && "xs:restriction".equals(node.getNodeName())) {
                return node;
            }
        }

        return null;
    }

    private void parseComplexTypes(FgistpRules fgistpRules, SchemaGrammar schemaGrammar) {
        XSNamedMap complexTypes = schemaGrammar.getComponents(XSTypeDefinition.COMPLEX_TYPE);
        // XSNamedMap simpleTypes = schemaGrammar.getComponents(XSTypeDefinition.SIMPLE_TYPE);

        XSNamedMap elements = schemaGrammar.getComponents(ELEMENT_DECLARATION);

        complexTypes.forEach((key, value) -> {
            XSComplexTypeDecl xsComplexType = (XSComplexTypeDecl) value;

            EntityType entityType = new EntityType(xsComplexType.getName());
            entityType.setTitle(fetchDescription(xsComplexType.getName(), elements));
            entityType.setProperties(fetchSequences(xsComplexType));

            fgistpRules.addComplexType(entityType);
        });
    }

    private List<SimplePropertyBase> fetchSequences(XSComplexTypeDecl xsComplexType) {
        List<SimplePropertyBase> properties = new ArrayList<>();

        XSParticleDecl particle = (XSParticleDecl) xsComplexType.getParticle();
        handleParticle(particle, properties);

        return properties;
    }

    private void handleParticle(XSParticleDecl particle, List<SimplePropertyBase> properties) {
        if (particle.fType == PARTICLE_MODELGROUP) {
            XSObjectList particles = ((XSModelGroupImpl) particle.getTerm()).getParticles();
            for (Object particleItem : particles) {
                handleParticle((XSParticleDecl) particleItem, properties);
            }
        } else if (particle.fType == PARTICLE_ELEMENT) {
            SimplePropertyBase property = mapParticleElement(particle);
            if (property != null) {
                properties.add(property);
            }
        } else {
            log.warn("Not parsing type: {} yet", particle.getType());
        }
    }

    private SimplePropertyBase mapParticleElement(XSParticleDecl element) {
        XSElementDecl term = (XSElementDecl) element.getTerm();

        if (term.getTypeDefinition() instanceof XSSimpleTypeDecl) {
            Optional<SimplePropertyBase> baseOptional = generateType((XSSimpleTypeDecl) term.getTypeDefinition());
            if (baseOptional.isPresent()) {
                SimplePropertyBase property = baseOptional.get();
                property.setName(term.getName());
                property.setMultiple(element.getMinOccurs() > 0);

                // Ложу сюда название простого типа из xsd схемы, для того чтобы оперется на эту инфу
                // при вытягивании алиасов для всех перечислений из простых типов.
                // После чего почищу описание...
                property.setDescription(term.getTypeDefinition().getName());

                if (term.getAnnotations().isEmpty()) {
                    XSObjectList annotations = ((XSSimpleTypeDecl) term.getTypeDefinition()).getAnnotations();
                    property.setTitle(handleAnnotation(annotations));
                } else {
                    property.setTitle(handleAnnotation(term.getAnnotations()));
                }

                return property;
            } else {
                return null;
            }
        } else {
            if (isGeometry(term.getName())) {
                return new GeometryProperty(term.getName());
            } else {
                return null;
            }
        }
    }

    private boolean isGeometry(String name) {
        return "Polygon".equals(name) || "Curve".equals(name) || "LineString".equals(name) || "Point".equals(name);
    }

    private Optional<SimplePropertyBase> generateType(XSSimpleTypeDecl simpleTypeDecl) {
        if (simpleTypeDecl.getName() == null) {
            log.warn("Look name deeper: {}", simpleTypeDecl.getBaseType().getName());
            return Optional.empty();
        }

        // Simple string like a "Name" without restrictions
        if (simpleTypeDecl.getName().contains("string")) {
            return Optional.of(new StringProperty());
        }

        if (!simpleTypeDecl.getLexicalEnumeration().isEmpty()) {
            EnumerationProperty enumerationProperty = new EnumerationProperty();

            for (int i = 0; i < simpleTypeDecl.getLexicalEnumeration().size(); i++) {
                XSDecimal xsDecimal = (XSDecimal) simpleTypeDecl.getActualEnumeration().get(i);
                enumerationProperty.addValue(xsDecimal.getInt());
            }

            return Optional.of(enumerationProperty);
        } else if (simpleTypeDecl.getBaseType().getName().contains("nteger")) {
            IntegerProperty integerProperty = new IntegerProperty();

            setIntegerValues(simpleTypeDecl, integerProperty);

            return Optional.of(integerProperty);
        } else if (simpleTypeDecl.getBaseType().getName().contains("string")) {
            StringProperty stringProperty = new StringProperty();

            setStringValues(simpleTypeDecl, stringProperty);

            return Optional.of(stringProperty);
        } else if (simpleTypeDecl.getName().contains("double")) {
            IntegerProperty integerProperty = new IntegerProperty();

            return Optional.of(integerProperty);

        } else if (simpleTypeDecl.getBaseType().getName().contains("decimal")) {
            IntegerProperty integerProperty = new IntegerProperty();

            setIntegerValues(simpleTypeDecl, integerProperty);

            return Optional.of(integerProperty);

        } else {
            log.warn("Not implemented yet");

            return Optional.empty();
        }
    }

    private void setIntegerValues(XSSimpleTypeDecl simpleTypeDecl, IntegerProperty integerProperty) {
        XSObject facetMinInclusive = simpleTypeDecl.getFacet(FACET_MININCLUSIVE);
        if (facetMinInclusive != null) {
            integerProperty.setMinInclusive(((XSFacet) facetMinInclusive).getIntFacetValue());
        }

        XSObject facetMaxInclusive = simpleTypeDecl.getFacet(FACET_MAXINCLUSIVE);
        if (facetMaxInclusive != null) {
            integerProperty.setMaxInclusive(((XSFacet) facetMaxInclusive).getIntFacetValue());
        }

        XSObject facetTotal = simpleTypeDecl.getFacet(FACET_TOTALDIGITS);
        if (facetTotal != null) {
            integerProperty.setTotalDigits(((XSFacet) facetTotal).getIntFacetValue());
        }
    }

    private void setStringValues(XSSimpleTypeDecl simpleTypeDecl, StringProperty stringProperty) {
        XSObject facetMinLength = simpleTypeDecl.getFacet(FACET_MINLENGTH);
        if (facetMinLength != null) {
            stringProperty.setMinLength(((XSFacet) facetMinLength).getIntFacetValue());
        }

        XSObject facetMaxLength = simpleTypeDecl.getFacet(FACET_MAXLENGTH);
        if (facetMaxLength != null) {
            stringProperty.setMaxLength(((XSFacet) facetMaxLength).getIntFacetValue());
        }

        XSObject facetPattern = simpleTypeDecl.getFacet(FACET_PATTERN);
        if (facetPattern != null) {
            String pattern = ((XSMultiValueFacet) facetPattern).getLexicalFacetValues().item(0);
            stringProperty.setPattern(pattern);
        }
    }

    private @NotNull String fetchDescription(String typeName, XSNamedMap elements) {
        for (int i = 0; i < elements.getLength(); i++) {
            XSElementDecl xsElementDecl = (XSElementDecl) elements.item(i);

            if (typeName.contains(xsElementDecl.getName())) {
                return handleAnnotation(xsElementDecl.getAnnotations());
            }
        }

        return "";
    }

    private @NotNull String handleAnnotation(XSObjectList annotations) {
        if (annotations.getLength() == 1) {
            return getDocumentation((XSAnnotation) annotations.get(0));
        } else if (annotations.getLength() > 1) {
            log.warn("Более двух аннотаций? Если так, то нужно пересмотреть этот метод.");
            return "";
        } else {
            return "";
        }
    }

    private @NotNull String getDocumentation(XSAnnotation annotation) {
        if (annotation.getAnnotationString().contains("documentation")) {
            return annotation.getAnnotationString().split("documentation>")[1].split("<")[0];
        } else {
            log.info("Annotation not contain documentation");
            return "";
        }
    }

    private Optional<SchemaGrammar> getFgistpGrammar(XSModel xsModel) {
        for (Object annotation : xsModel.getNamespaceItems()) {
            String targetNamespace = ((SchemaGrammar) annotation).getTargetNamespace();
            if (TARGET_NAMESPACE.equals(targetNamespace)) {
                return Optional.of((SchemaGrammar) annotation);
            }
        }

        return Optional.empty();
    }

}
