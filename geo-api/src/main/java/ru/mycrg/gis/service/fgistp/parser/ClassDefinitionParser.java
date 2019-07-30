package ru.mycrg.gis.service.fgistp.parser;

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
import ru.mycrg.gis.service.fgistp.FeatureDescription;
import ru.mycrg.common.propertyTypes.*;
import ru.mycrg.gis.service.fgistp.rules.FgistpRules;

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
import static ru.mycrg.gis.service.fgistp.parser.FeaturesUtil.*;

@Service
public class ClassDefinitionParser {

    private static Logger log = LoggerFactory.getLogger(ClassDefinitionParser.class);

    private int sequenceNumber = 0;
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
            fillDescription(fgistpRules.getFeatureDescriptions());
            joinGeometry(fgistpRules.getFeatureDescriptions());
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

            FeatureDescription featureDescription = new FeatureDescription(xsComplexType.getName());
            fillOriginNameAndTitle(featureDescription, xsComplexType.getName(), elements);
            featureDescription.setProperties(fetchSequences(xsComplexType));

            if (featureDescription.getName() == null) {
                log.warn("Feature has empty name: {}", xsComplexType.getName());
            }

            if (featureDescription.getTitle() == null) {
                log.info("Feature has empty title: {}. Do not add it to list.", featureDescription.getName());
            } else {
                fgistpRules.addComplexType(featureDescription);
            }
        });
    }

    private List<AbstractProperty> fetchSequences(XSComplexTypeDecl xsComplexType) {
        sequenceNumber = 0;

        List<AbstractProperty> properties = new ArrayList<>();

        XSParticleDecl particle = (XSParticleDecl) xsComplexType.getParticle();
        handleParticle(particle, properties);

        return properties;
    }

    private void handleParticle(XSParticleDecl particle, List<AbstractProperty> properties) {
        if (particle.fType == PARTICLE_MODELGROUP) {
            XSObjectList particles = ((XSModelGroupImpl) particle.getTerm()).getParticles();
            for (Object particleItem : particles) {
                handleParticle((XSParticleDecl) particleItem, properties);
            }
        } else if (particle.fType == PARTICLE_ELEMENT) {
            AbstractProperty property = mapParticleElement(particle);
            if (property != null) {
                property.setSequenceNumber(++sequenceNumber);
                properties.add(property);
            }
        } else {
            log.warn("Not parsing type: {} yet", particle.getType());
        }
    }

    private AbstractProperty mapParticleElement(XSParticleDecl element) {
        XSElementDecl term = (XSElementDecl) element.getTerm();

        if (term.getTypeDefinition() instanceof XSSimpleTypeDecl) {
            Optional<AbstractProperty> baseOptional = generateType((XSSimpleTypeDecl) term.getTypeDefinition());
            if (baseOptional.isPresent()) {
                return handleProperty(element, term, baseOptional.get());
            } else {
                log.warn("cant define type for: {}", term.getName());

                StringProperty stringProperty = new StringProperty();
                setStringValues((XSSimpleTypeDecl) term.getTypeDefinition(), stringProperty);

                return handleProperty(element, term, stringProperty);
            }
        } else {
            if (isGeometry(term.getName())) {
                return new GeometryProperty(term.getName());
            } else {
                return null;
            }
        }
    }

    private AbstractProperty handleProperty(XSParticleDecl element, XSElementDecl term, AbstractProperty property) {
        property.setName(term.getName());
        property.setRequired(element.getMinOccurs() > 0);

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
    }

    private boolean isGeometry(String name) {
        return "Polygon".equals(name) || "Curve".equals(name) || "LineString".equals(name) || "Point".equals(name);
    }

    private Optional<AbstractProperty> generateType(XSSimpleTypeDecl simpleTypeDecl) {
        if (simpleTypeDecl.getName() == null) {
            log.warn("Look name deeper: {}", simpleTypeDecl.getBaseType().getName());
            return Optional.empty();
        }

        // Simple string like a "Name" without restrictions
        if (simpleTypeDecl.getName().contains("string")) {
            StringProperty stringProperty = new StringProperty();

            setStringValues(simpleTypeDecl, stringProperty);

            return Optional.of(stringProperty);
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
            DoubleProperty doubleProperty = new DoubleProperty();

            setDoubleValues(simpleTypeDecl, doubleProperty);

            return Optional.of(doubleProperty);

        } else if (simpleTypeDecl.getBaseType().getName().contains("decimal")) {
            DoubleProperty doubleProperty = new DoubleProperty();

            setDoubleValues(simpleTypeDecl, doubleProperty);

            return Optional.of(doubleProperty);
        } else {
            log.warn("Not implemented yet");

            return Optional.empty();
        }
    }

    private void setIntegerValues(XSSimpleTypeDecl simpleTypeDecl, IntegerProperty integerProperty) {
        XSObject facetMinInclusive = simpleTypeDecl.getFacet(FACET_MININCLUSIVE);
        if (facetMinInclusive != null) {
            Object facetValue = ((XSFacet) facetMinInclusive).getActualFacetValue();
            integerProperty.setMinInclusive(Integer.valueOf(facetValue.toString()));
        }

        XSObject facetMaxInclusive = simpleTypeDecl.getFacet(FACET_MAXINCLUSIVE);
        if (facetMaxInclusive != null) {
            Object facetValue = ((XSFacet) facetMaxInclusive).getActualFacetValue();
            integerProperty.setMaxInclusive(Integer.valueOf(facetValue.toString()));
        }
    }

    private void setDoubleValues(XSSimpleTypeDecl simpleTypeDecl, DoubleProperty doubleProperty) {
        XSObject facetTotal = simpleTypeDecl.getFacet(FACET_TOTALDIGITS);
        if (facetTotal != null) {
            doubleProperty.setTotalDigits(((XSFacet) facetTotal).getIntFacetValue());
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

    private void fillOriginNameAndTitle(FeatureDescription featureDescription, String typeName, XSNamedMap elements) {
        String featureName = removePostfix(typeName);

        for (int i = 0; i < elements.getLength(); i++) {
            XSElementDecl xsElementDecl = (XSElementDecl) elements.item(i);

            if (featureName.toLowerCase().equals(xsElementDecl.getName().toLowerCase())) {
                featureDescription.setOriginName(xsElementDecl.getName());
                featureDescription.setTitle(handleAnnotation(xsElementDecl.getAnnotations()));
                featureDescription.setTableName(xsElementDecl.getName().toLowerCase());
            }
        }
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
