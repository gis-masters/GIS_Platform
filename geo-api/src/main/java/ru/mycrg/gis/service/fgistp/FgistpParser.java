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
import ru.mycrg.gis.dto.fgistp.*;
import ru.mycrg.gis.dto.fgistp.types.FgistpBaseType;
import ru.mycrg.gis.dto.fgistp.types.FgistpEnumeration;
import ru.mycrg.gis.dto.fgistp.types.FgistpInteger;
import ru.mycrg.gis.dto.fgistp.types.FgistpString;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;
import java.util.*;

import static org.apache.xerces.impl.xs.XSParticleDecl.PARTICLE_ELEMENT;
import static org.apache.xerces.impl.xs.XSParticleDecl.PARTICLE_MODELGROUP;
import static org.apache.xerces.xs.XSConstants.ELEMENT_DECLARATION;
import static org.apache.xerces.xs.XSSimpleTypeDefinition.*;

@Service
public class FgistpParser {

    private static Logger log = LoggerFactory.getLogger(FgistpParser.class);

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
            addEnumerationAlias(fgistpRules, fetchSimpleTypeEnumerationsAlias(file));
        } catch (ClassNotFoundException | IllegalAccessException | InstantiationException |
                ParserConfigurationException | IOException | SAXException e) {
            log.error("Error parse file: " + file.getName(), e);
        }

        return fgistpRules;
    }

    private void addEnumerationAlias(FgistpRules fgistpRules, List<FgistpSimpleType> simpleTypes) {
        fgistpRules.getFgistpClassTypes()
                .forEach(complexType -> {
                    String complexTypeName = complexType.getName();
                    complexType.getProperties()
                            .forEach(complexProperty -> {
                                String propertyName = complexProperty.getName();

                                if ("CLASSID".equals(propertyName)) {
                                    propertyName = complexTypeName.replace("Type", "CLASSID");
                                }

                                getSimpleTypeByName(simpleTypes, propertyName)
                                        .ifPresent(simpleType -> setAlias(simpleType.getProperties(), complexProperty));
                            });
                });
    }

    private void setAlias(Map<String, String> simpleType, FgistpProperty complexProperty) {
        if (complexProperty.getBaseType() instanceof FgistpEnumeration) {
            ((FgistpEnumeration) complexProperty.getBaseType()).getEnumerations()
                    .forEach(valueAliasProjection -> {
                        String alias = simpleType.get(valueAliasProjection.getValue());
                        valueAliasProjection.setAlias(alias);
                    });
        } else {
            log.warn("--- {}", complexProperty.getName());
        }
    }

    private Optional<FgistpSimpleType> getSimpleTypeByName(List<FgistpSimpleType> simpleTypes, String propertyName) {
        return simpleTypes.stream()
                .filter(simpleType -> simpleType.getName().equals(propertyName))
                .findFirst();
    }

    private List<FgistpSimpleType> fetchSimpleTypeEnumerationsAlias(File file)
            throws ParserConfigurationException, IOException, SAXException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(file);
        NodeList nodeList = document.getDocumentElement().getChildNodes();

        return getSimpleNodes(nodeList);
    }

    private List<FgistpSimpleType> getSimpleNodes(NodeList nodeList) {
        List<FgistpSimpleType> simpleTypes = new ArrayList<>();

        for (int i = 0; i < nodeList.getLength(); i++) {
            Node node = nodeList.item(i);
            if (node.getNodeType() == Node.ELEMENT_NODE && "xs:simpleType".equals(node.getNodeName())) {
                FgistpSimpleType simpleType = new FgistpSimpleType();

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
        XSNamedMap simpleTypes = schemaGrammar.getComponents(XSTypeDefinition.SIMPLE_TYPE);

        XSNamedMap elements = schemaGrammar.getComponents(ELEMENT_DECLARATION);

        complexTypes.forEach((key, value) -> {
            XSComplexTypeDecl xsComplexType = (XSComplexTypeDecl) value;

            FgistpClassType fgistpClassType = new FgistpClassType(xsComplexType.getName());
            fgistpClassType.setAlias(fetchDescription(xsComplexType.getName(), elements));
            fgistpClassType.setProperties(fetchSequences(xsComplexType));

            redefineGeometry(fgistpClassType);

            fgistpRules.addComplexType(fgistpClassType);
        });
    }

    private void redefineGeometry(FgistpClassType fgistpClassType) {
        fgistpClassType
                .getProperties().stream()
                .filter(property -> isGeometry(property.getName()))
                .forEach(property -> {
                    fgistpClassType.addGeometry(property.getName());
                });

        fgistpClassType.getProperties().removeIf(property -> isGeometry(property.getName()));
    }

    private List<FgistpProperty> fetchSequences(XSComplexTypeDecl xsComplexType) {
        List<FgistpProperty> fgistpProperties = new ArrayList<>();

        XSParticleDecl particle = (XSParticleDecl) xsComplexType.getParticle();
        handleParticle(particle, fgistpProperties);

        return fgistpProperties;
    }

    private void handleParticle(XSParticleDecl particle, List<FgistpProperty> fgistpProperties) {
        if (particle.fType == PARTICLE_MODELGROUP) {
            XSObjectList particles = ((XSModelGroupImpl) particle.getTerm()).getParticles();
            for (Object particleItem : particles) {
                handleParticle((XSParticleDecl) particleItem, fgistpProperties);
            }
        } else if (particle.fType == PARTICLE_ELEMENT) {
            FgistpProperty property = mapParticleElement(particle);
            if (property != null) {
                fgistpProperties.add(property);
            }
        } else {
            log.warn("Not parsing type: {} yet", particle.getType());
        }
    }

    private FgistpProperty mapParticleElement(XSParticleDecl element) {
        XSElementDecl term = (XSElementDecl) element.getTerm();

        if (term.getTypeDefinition() instanceof XSSimpleTypeDecl) {
//            if (term.getName().equals("CONSTR_DEN")) {
//                log.warn("Look name deeper");
//            }

            FgistpProperty property = new FgistpProperty(term.getName());
            property.setAlias(handleAnnotation(term.getAnnotations()));
            property.setBaseType(generateType((XSSimpleTypeDecl) term.getTypeDefinition()));
            property.setMinOccurs(element.getMinOccurs());
            property.setMaxOccurs(element.getMaxOccurs());

            return property;
        } else {
            if (isGeometry(term.getName())) {
                return new FgistpProperty(term.getName());
            } else {
                return null;
            }
        }
    }

    private boolean isGeometry(String name) {
        return "Polygon".equals(name) || "Curve".equals(name) || "LineString".equals(name) || "Point".equals(name);
    }

    private FgistpBaseType generateType(XSSimpleTypeDecl simpleTypeDecl) {
        if (simpleTypeDecl.getName() == null) {
            log.warn("Look name deeper: {}", simpleTypeDecl.getBaseType().getName());
            return null;
        }

        // Simple string like a "Name" without restrictions
        if (simpleTypeDecl.getName().contains("string")) {
            return new FgistpString();
        }

        if (!simpleTypeDecl.getLexicalEnumeration().isEmpty()) {
            FgistpEnumeration fgistpEnumeration = new FgistpEnumeration();

            for (int i = 0; i < simpleTypeDecl.getLexicalEnumeration().size(); i++) {
                XSDecimal xsDecimal = (XSDecimal) simpleTypeDecl.getActualEnumeration().get(i);
                fgistpEnumeration.addValue(xsDecimal.getInt());
            }

            return fgistpEnumeration;
        } else if (simpleTypeDecl.getBaseType().getName().contains("nteger")) {
            FgistpInteger fgistpInteger = new FgistpInteger();

            setStringValues(simpleTypeDecl, fgistpInteger);
            setIntegerValues(simpleTypeDecl, fgistpInteger);

            return fgistpInteger;
        } else if (simpleTypeDecl.getBaseType().getName().contains("string")) {
            FgistpString fgistpString = new FgistpString();

            setStringValues(simpleTypeDecl, fgistpString);

            return fgistpString;
        } else if (simpleTypeDecl.getName().contains("double")) {
            FgistpInteger fgistpInteger = new FgistpInteger();

            setStringValues(simpleTypeDecl, fgistpInteger);
            setIntegerValues(simpleTypeDecl, fgistpInteger);

            return fgistpInteger;

        } else if (simpleTypeDecl.getBaseType().getName().contains("decimal")) {
            FgistpInteger fgistpInteger = new FgistpInteger();

            setStringValues(simpleTypeDecl, fgistpInteger);
            setIntegerValues(simpleTypeDecl, fgistpInteger);

            return fgistpInteger;

        } else {
            log.warn("Not implemented yet");

            return null;
        }
    }

    private void setIntegerValues(XSSimpleTypeDecl simpleTypeDecl, FgistpInteger fgistpInteger) {
        XSObject facetMinInclusive = simpleTypeDecl.getFacet(FACET_MININCLUSIVE);
        if (facetMinInclusive != null) {
            fgistpInteger.setMinInclusive(((XSFacet) facetMinInclusive).getIntFacetValue());
        }

        XSObject facetMaxInclusive = simpleTypeDecl.getFacet(FACET_MAXINCLUSIVE);
        if (facetMaxInclusive != null) {
            fgistpInteger.setMaxInclusive(((XSFacet) facetMaxInclusive).getIntFacetValue());
        }

        XSObject facetTotal = simpleTypeDecl.getFacet(FACET_TOTALDIGITS);
        if (facetTotal != null) {
            fgistpInteger.setTotalDigits(((XSFacet) facetTotal).getIntFacetValue());
        }
    }

    private void setStringValues(XSSimpleTypeDecl simpleTypeDecl, FgistpString fgistpString) {
        XSObject facetMinLength = simpleTypeDecl.getFacet(FACET_MINLENGTH);
        if (facetMinLength != null) {
            fgistpString.setMinLength(((XSFacet) facetMinLength).getIntFacetValue());
        }

        XSObject facetMaxLength = simpleTypeDecl.getFacet(FACET_MAXLENGTH);
        if (facetMaxLength != null) {
            fgistpString.setMaxLength(((XSFacet) facetMaxLength).getIntFacetValue());
        }

        XSObject facetPattern = simpleTypeDecl.getFacet(FACET_PATTERN);
        if (facetPattern != null) {
            String pattern = ((XSMultiValueFacet) facetPattern).getLexicalFacetValues().item(0);
            fgistpString.setPattern(pattern);
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
