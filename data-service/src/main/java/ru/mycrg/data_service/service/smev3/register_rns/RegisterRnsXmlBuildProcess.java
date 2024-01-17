package ru.mycrg.data_service.service.smev3.register_rns;

import com.sun.xml.bind.marshaller.NamespacePrefixMapper;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.fields.*;
import ru.mycrg.data_service.register_rns_1_0_10.*;
import ru.mycrg.data_service.service.schemas.SchemaService;
import ru.mycrg.data_service.service.smev3.AXmlBuildProcess;
import ru.mycrg.data_service.service.smev3.SmevOutgoingAttachmentService;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.util.xml.XmlMapper;
import ru.mycrg.data_service.util.xml.XmlMarshaller;
import ru.mycrg.data_service.util.JsonConverter;

import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Optional.of;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.service.smev3.register_rns.RegisterRnsRequestService.MNEMONIC;
import static ru.mycrg.data_service.service.smev3.register_rns.RegisterRnsRequestService.MNEMONIC_VERSION;

public class RegisterRnsXmlBuildProcess extends AXmlBuildProcess {
    private final Logger log = LoggerFactory.getLogger(RegisterRnsXmlBuildProcess.class);
    private final Smev3Config smev3Config;
    private final XmlMarshaller marshaller = new XmlMarshaller(namespacePrefixMapper);
    private final ReusableElements reusable = new ReusableElements();
    private final SmevOutgoingAttachmentService attachmentService;
    private UUID clientId;
    private ClientMessage xmlObject;
    private Boolean stubFields;
    private Boolean stubAttachments;

    public RegisterRnsXmlBuildProcess(Smev3Config smev3Config, BaseDao baseDao, SchemaService schemaService, SmevOutgoingAttachmentService attachmentService) {
        super(baseDao, schemaService);
        this.smev3Config = smev3Config;
        this.attachmentService = attachmentService;
    }

    public XmlBuildMeta run(@NotNull Long recId, Boolean stubFields, Boolean stubAttachments) {
        this.clientId = UUID.randomUUID();
        this.reusable.section13recordId = recId;
        this.stubFields = stubFields;
        this.stubAttachments = stubAttachments;

        try {
            // основной бизнес запрос
            var request = requestType();

            var primaryContent = new MessagePrimaryContent();
            primaryContent.setRequest(request);

            var content = new Content();
            content.setMessagePrimaryContent(primaryContent);

            var contentType = new RequestContentType();
            contentType.setContent(content);

            var metadataType = new RequestMetadataType();
            metadataType.setClientId(clientId.toString());

            var messageType = new RequestMessageType();
            messageType.setRequestMetadata(metadataType);
            messageType.setRequestContent(contentType);

            xmlObject = new ClientMessage();
            xmlObject.setItSystem(smev3Config.getSystemMnemonic());
            xmlObject.setRequestMessage(messageType);

            //TODO временная мера
            if (stubAttachments) {
                fillStubAttachments();
            } else {
                var attachmentHeaderTypeList = attachmentHeaderTypeList();

                var attachmentHeaderList = new AttachmentHeaderList();
                attachmentHeaderList.getAttachmentHeader().addAll(attachmentHeaderTypeList);
                content.setAttachmentHeaderList(attachmentHeaderList);
            }

            // TODO временная мера
            if (stubFields) {
                fillStubFields();
            }

            var xmlText = marshaller.marshall(xmlObject, ClientMessage.class);
            log.debug("SMEV3. request: {}", xmlText);

            var xmlObjectJson = JsonConverter.toJsonNode(xmlObject);

            var sourceJson = of(sourceRecords)
                    .map(map -> map.isEmpty() ? null : map.entrySet())
                    .map(Collection::stream)
                    .map(stream -> stream.collect(Collectors.toMap(Map.Entry::getKey, entry -> entry.getValue().getContent())))
                    .map(JsonConverter::toJsonNode)
                    .orElse(null);

            var attachmentsJson = of(attachments)
                    .map(object -> object.isEmpty() ? null : object.values())
                    .map(ArrayList::new)
                    .map(JsonConverter::toJsonNode)
                    .orElse(null);

            return new XmlBuildMeta(
                    MNEMONIC,
                    MNEMONIC_VERSION,
                    clientId,
                    null,
                    xmlObjectJson,
                    xmlText,
                    sourceJson,
                    attachmentsJson
            );
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }

    private void fillStubAttachments() {
        var request = xmlObject
                .getRequestMessage()
                .getRequestContent()
                .getContent()
                .getMessagePrimaryContent()
                .getRequest()
                .getRegisterNewConstruction();

        // Scans
        var file = new FileType();
        file.setName("Разрешение_на_строительство_22-1");
        var attachRef = new AttachmentRefType();
        attachRef.setAttachmentId("{urn://x-artefacts-smev-gov-ru/smev-core/client-interaction/basic/1.0:AttachedFile}[n]/Id/text()");
        file.setAttachmentRef(attachRef);
        request.getScans().add(file);
    }

    /**
     * временно заполняем того чего нет
     */
    private void fillStubFields() {
        var request = xmlObject
                .getRequestMessage()
                .getRequestContent()
                .getContent()
                .getMessagePrimaryContent()
                .getRequest()
                .getRegisterNewConstruction();

        // MailingAddress
        var addressElementTypeCity = new AddressElementType();
        addressElementTypeCity.setType("г");
        addressElementTypeCity.setName("Симферополь");

        var refBookTypeRaion = new RefBookType();
        refBookTypeRaion.setCode("1");
        refBookTypeRaion.setName("Район");

        var addressElementType = new AddressElementType();
        addressElementType.setType("ул");
        addressElementType.setName("Хромченко");

        var addressFullType = new AddressFullType();
        addressFullType.setRegion("91");
        addressFullType.setFIAS("ef8f9fe1-bc9f-48ca-8219-92a87f8af4c7");
        addressFullType.setLocality(addressElementTypeCity);
        addressFullType.setStreet(addressElementType);
        addressFullType.setHouseNumber("23");
        addressFullType.setBuildingNumber("соор 1");
        addressFullType.setNote("295014 Симферополь, ул. Хромченко д 23, соор 1");
        addressFullType.setOKTMO("46771000001");
        addressFullType.setElementPlanStructure(refBookTypeRaion);

        request.getRecipientInfo().setMailingAddress(addressFullType);

        //IssueOrgan
        var organizationInfoType = new OrganizationInfoType();
        organizationInfoType.setOGRN("1185053037476");
        organizationInfoType.setINN("5024190060");
        request.setIssueOrgan(organizationInfoType);

        // IssuePerson
        var fioType = new FIOType();
        fioType.setMiddleName("Степанов");
        fioType.setName("Степанов");
        fioType.setSurname("Степанов");
        request.setIssuePerson(fioType);

        // IssuePersonPosition
        request.setIssuePersonPosition("Сотрудник");

        // ObjectInfo
        var objectInfo = request.getObjectInfo().get(0);

        // ObjectInfo - ObjectName
        objectInfo.setObjectAddress(addressFullType);

        // ObjectInfo - ObjectName
        objectInfo.setObjectName("12-ти этажный жилой дом со встроенными помещениями");

        // ObjectInfo - ObjectKind
        var refBookTypeHouse = new RefBookType();
        refBookTypeHouse.setCode("1");
        refBookTypeHouse.setName("Многоквартирный дом");
        objectInfo.setObjectKind(refBookTypeHouse);

        // ObjectInfo - ObjectPurpose
        objectInfo.setObjectPurpose(refBookTypeHouse);

        // ObjectInfo - ObjectPurposeFunctional
        var refBookTypeHouse2 = new RefBookType();
        refBookTypeHouse2.setCode("3");
        refBookTypeHouse2.setName("Жилое здание");
        objectInfo.setObjectPurposeFunctional(refBookTypeHouse2);

        // ObjectInfo - BuildCapitalType
        var refBookTypeHouse3 = new RefBookType();
        refBookTypeHouse3.setCode("1");
        refBookTypeHouse3.setName("Здание");
        objectInfo.setBuildCapitalType(refBookTypeHouse3);

        // ObjectInfo - InfoDocDescriptionType
        var infoDocDescription = objectInfo.getInfoDocDescription();
        var expertiseProjectDocDescriptio = infoDocDescription.getExpertiseProjectDocDescription().get(0);
        var refBookTypeExcpert = new RefBookType();
        refBookTypeExcpert.setCode("1");
        refBookTypeExcpert.setName("Экспертиза проектной документации");
        expertiseProjectDocDescriptio.setProjectDocType(refBookTypeExcpert);

        reusable.organDocInfo.setOrganizationName("ГАУ МО МОСОБЛГОСЭКСПЕРТИЗА");
        reusable.organDocInfo.setIsResident(false);
        reusable.organDocInfo.setINN("5260292932");
        reusable.organDocInfo.setOGRNCompany("1105260019457");

        // ObjectInfo - InfoDocDescriptionType - DemarcationDescription
        var demarcationDescription = infoDocDescription.getDemarcationDescription().get(0);
        var refBookTypePosta = new RefBookType();
        refBookTypePosta.setCode("1");
        refBookTypePosta.setName("Постановление");
        demarcationDescription.setAdministrativeDocType(refBookTypePosta);

        // ObjectInfo - InfoDocDescriptionType - EcologicalExpertiseDescriptionType
        var ecologicalExpertiseDescriptionType = infoDocDescription.getEcologicalExpertiseDescription().get(0);
        ecologicalExpertiseDescriptionType.setOrganDocInfo(reusable.organDocInfo);

        // ObjectInfo - InfoDocDescriptionType - ProjectDocumentationDescription
        infoDocDescription.setProjectDocumentationAvailability(AvailabilityDocType.AVAILABLE);
        var projectDocumentationDescriptionType = new ProjectDocumentationDescriptionType();
        projectDocumentationDescriptionType.setDocumentationDate(XmlMapper.mapCalendar(LocalDate.now()));
        projectDocumentationDescriptionType.setProjectDocCode("Сведения о проектной документации");
        projectDocumentationDescriptionType.setProjectDocYear(new BigInteger("2022"));
        projectDocumentationDescriptionType.setDeveloperType(DocumentDeveloperType.LEGAL);
        projectDocumentationDescriptionType.setOrganDocInfo(reusable.organDocInfo);
        infoDocDescription.getProjectDocumentationDescription().add(projectDocumentationDescriptionType);
    }

    /**
     * Корневая сущность
     */
    private RequestType requestType() {
        var section13Record = getRecordById(
                LIBRARY_RECORD,
                SYSTEM_SCHEMA_NAME,
                FieldsSection.TABLE_13,
                FieldsSection.TABLE_13,
                reusable.section13recordId
        );

        var type = new ConstructionType();
        asString(section13Record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setConstPermitNumber);
        asLocalDateTime(section13Record, FieldsSection.PROPERTY_DOC_DATE)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar)
                .ifPresent(type::setConstPermitDate);
        asString(section13Record, FieldsSection.PROPERTY_IDENTIFIER)
                .ifPresent(type::setConstPermitID);
        asInt(section13Record, FieldsSection.PROPERTY_CONST_GOVERNMENT_ORDER_ID)
                .ifPresent(type::setConstGovernmentOrderId);
        asString(section13Record, FieldsSection.PROPERTY_CONST_CADASTRAL_DISTRICT)
                .ifPresent(type::setConstCadastralDistrict);
        asString(section13Record, FieldsSection.PROPERTY_CONST_CADASTRAL_AREA)
                .ifPresent(type::setConstCadastralArea);
        asRefBookType(section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_CONSTRUCTION_TYPE)
                .ifPresent(type::setConstructionKind);
        asRefBookType(section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_PERMISSION_TYPE)
                .ifPresent(type::setConstPermissionType);
        asString(section13Record, FieldsSection.PROPERTY_NAME_FROM_P_D)
                .ifPresent(type::setObjectNameProjectDoc);
        asString(section13Record, FieldsSection.PROPERTY_NUMBER_OBJECTS)
                .ifPresent(type::setNumberObjects);
        asString(section13Record, FieldsSection.PROPERTY_NUMBER_LONG_OBJECTS)
                .ifPresent(type::setNumberLongObjects);
        asStatus(section13Record, FieldsSection.PROPERTY_DOC_STATUS)
                .ifPresent(type::setStatusConstruction);
        asLocalDateTime(section13Record, FieldsSection.PROPERTY_VALID_UNTIL)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar)
                .ifPresent(type::setExpireDate);
        asRefRecord(section13Record, FieldsSection.PROPERTY_DEVELOPER_DATA_CONNECTION)
                .map(this::recipientInfo_CitOrOrg)
                .ifPresent(type::setRecipientInfo);
        asRefRecord(section13Record, FieldsSection.PROPERTY_SUPPLIER_DATA_CONNECTION)
                .flatMap(rec -> asRefRecord(rec, FieldsSupplier.PROPERTY_ORGANIZATION_DATA_CONNECTION))
                .map(this::organizationInfoType)
                .ifPresent(type::setIssueOrgan);

        if (stubAttachments == false) {
            asFileRecord(section13Record, FieldsSection.PROPERTY_FILE)
                    .map(this::attachments)
                    .ifPresent(u -> type.getScans().addAll(u));
        }

        type.getObjectInfo().add(objectInfo());

        var request = new RequestType();
        request.setRegisterNewConstruction(type);

        return request;
    }

    private List<FileType> attachments(List<IRecord> filesRecord) {
        return filesRecord
                .stream()
                .map(record -> {
                    var fileId = record.getAsString(FieldsFiles.PROPERTY_ID);
                    if (!attachments.containsKey(fileId)) {
                        var smevAttachment = attachmentService.pushAttachment(record);
                        attachments.put(smevAttachment.getFileId(), smevAttachment);
                    }
                    var existsAttachment = attachments.get(fileId);

                    var attachmentRef = new AttachmentRefType();
                    attachmentRef.setAttachmentId(existsAttachment.getAttachmentId().toString());
                    var filetype = new FileType();
                    filetype.setName(existsAttachment.getFileName());
                    filetype.setAttachmentRef(attachmentRef);

                    return filetype;
                })
                .collect(Collectors.toList());
    }

    private RecipientInfoType recipientInfo_CitOrOrg(IRecord customerRecord) {
        return asRefRecord(customerRecord, FieldsCustomer.PROPERTY_ORGANIZATION)
                .map(this::recipientInfoType_Org)
                .orElseGet(() ->
                        asRefRecord(customerRecord, FieldsCustomer.PROPERTY_CITIZEN)
                                .map(this::recipientInfoType_Cit)
                                .orElse(null)
                );
    }

    private RecipientInfoType recipientInfoType_Cit(IRecord citizenRecord) {
        var addressFullType = new AddressFullType();
        asString(citizenRecord, FieldsCitizen.PROPERTY_ACTUAL_ADDRESS)
                .ifPresent(addressFullType::setRegion);

        var personInfoType = new PersonInfoType();
        asString(citizenRecord, FieldsCitizen.PROPERTY_INN)
                .ifPresent(personInfoType::setINN);
        asString(citizenRecord, FieldsCitizen.PROPERTY_SNILS)
                .ifPresent(personInfoType::setSNILS);
        asString(citizenRecord, FieldsCitizen.PROPERTY_TITLE)
                .map(RegisterRnsXmlBuildProcess::mapFio)
                .ifPresent(personInfoType::setRecipientFIO);

        var recipientInfoType = new RecipientInfoType();
        asString(citizenRecord, FieldsCitizen.PROPERTY_EMAIL).ifPresent(recipientInfoType::setEmail);
        recipientInfoType.setMailingAddress(addressFullType);
        recipientInfoType.setPersonInfo(personInfoType);

        return recipientInfoType;
    }

    private RecipientInfoType recipientInfoType_Org(IRecord organizationRecord) {
        var addressFullType = new AddressFullType();
        asString(organizationRecord, FieldsOrganization.PROPERTY_ACTUAL_ADDRESS).ifPresent(addressFullType::setRegion);

        var organizationInfoType = new OrganizationInfoType();
        asString(organizationRecord, FieldsOrganization.PROPERTY_FULL_TITLE).ifPresent(organizationInfoType::setOrganizationName);
        asString(organizationRecord, FieldsOrganization.PROPERTY_ORGN).ifPresent(organizationInfoType::setOGRN);
        asString(organizationRecord, FieldsOrganization.PROPERTY_INN).ifPresent(organizationInfoType::setINN);
        asString(organizationRecord, FieldsOrganization.PROPERTY_KPP).ifPresent(organizationInfoType::setKPP);

        var recipientInfoType = new RecipientInfoType();
        asString(organizationRecord, FieldsOrganization.PROPERTY_EMAIL).ifPresent(recipientInfoType::setEmail);
        recipientInfoType.setMailingAddress(addressFullType);
        recipientInfoType.setOrganizationInfo(organizationInfoType);
        return recipientInfoType;
    }

    private OrganizationInfoType organizationInfoType(IRecord organizationRecord) {
        var type = new OrganizationInfoType();
        asString(organizationRecord, FieldsOrganization.PROPERTY_FULL_TITLE).ifPresent(type::setOrganizationName);
        asString(organizationRecord, FieldsOrganization.PROPERTY_INN).ifPresent(type::setINN);
        asString(organizationRecord, FieldsOrganization.PROPERTY_ORGN).ifPresent(type::setOGRN);
        asString(organizationRecord, FieldsOrganization.PROPERTY_KPP).ifPresent(type::setKPP);
        return type;
    }

    private ObjectInfoType objectInfo() {
        var rsoksRecord = getRecordByJsonIdValue(
                LIBRARY_RECORD,
                SYSTEM_SCHEMA_NAME,
                FieldsRsoks.TABLE,
                FieldsRsoks.TABLE,
                FieldsRsoks.PROPERTY_DL_DATA_SECTION13_DATA_CONNECTION,
                reusable.section13recordId
        );

        var type = new ObjectInfoType();
        type.setObjectProjectDescription(objectProjectDescriptionType(rsoksRecord));
        type.setInfoDocDescription(infoDocDescriptionType(rsoksRecord));
        return type;
    }

    private ObjectProjectDescriptionType objectProjectDescriptionType(IRecord rsoksRecord) {
        var rsoksPartRecord = getRecordByJsonIdValue(
                LIBRARY_RECORD,
                SYSTEM_SCHEMA_NAME,
                FieldsRsoksPart.TABLE,
                FieldsRsoksPart.TABLE,
                FieldsRsoksPart.PROPERTY_DL_DATA_RSOKS_DATA_CONNECTION,
                rsoksRecord.getId()
        );

        var type = new ObjectProjectDescriptionType();
        type.setProjectLongObjects(projectLongObjectsType(rsoksPartRecord));
        type.setOtherProjectObject(otherProjectObjectType(rsoksPartRecord));
        type.setShortProjectObject(shortProjectObjectType(rsoksPartRecord));
        return type;
    }

    private OtherProjectObjectType otherProjectObjectType(IRecord rsoksPartRecord) {
        var type = new OtherProjectObjectType();
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_APPARTMENTS_TOTAL)
                .ifPresent(type::setNumberApartments);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_ONE_ROOM_PR)
                .ifPresent(type::setNumberOneRoom);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_ONE_ROOM_AREA_PR)
                .ifPresent(type::setAreaOneRoom);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_TWO_ROOM_PR)
                .ifPresent(type::setNumberTwoRoom);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_TWO_ROOM_AREA_PR)
                .ifPresent(type::setAreaTwoRoom);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_THREE_ROOM_PR)
                .ifPresent(type::setNumberThreeRoom);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_THREE_ROOM_AREA_PR)
                .ifPresent(type::setAreaThreeRoom);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_FOUR_ROOM_PR)
                .ifPresent(type::setNumberFourRoom);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_FOUR_ROOM_AREA_FA)
                .ifPresent(type::setAreaFourRoom);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_MORE_THEN_FOUR_ROOM_FA)
                .ifPresent(type::setNumberMoreRoom);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_MORE_THEN_FOUR_ROOM_AREA_FA)
                .ifPresent(type::setAreaMoreRoom);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_LIVING_AREA_WITH_BALCONY_FA)
                .ifPresent(type::setLivingArea2);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_LIVING_AREA_WITHOUT_BALCONY_FA)
                .ifPresent(type::setLivingArea);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_LIVING_AREA_WITHOUT_BALCONY_FA)
                .ifPresent(type::setLivingArea);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_AREA_NOT_LIVING_FA)
                .ifPresent(type::setUnlivingArea);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_NUMBER_NOT_LIVING_ROOM_FA)
                .ifPresent(type::setNumberUnlivigPremise);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_NUMBER_LIVING_ROOM_FA)
                .ifPresent(type::setPremisesLivingCount);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_NUMBER_ROOM_FA)
                .ifPresent(type::setPremisesCount);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_PARKING_SPACE_FA)
                .ifPresent(type::setNumberParkingSpase);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_ESCALATORS_FA)
                .ifPresent(type::setElevators);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_WHEELCHAIR_LIFTS_FA)
                .ifPresent(type::setWheelchairLifts);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_FOUNDATION_MATERIALS_FA)
                .ifPresent(type::setCorrectMaterialsFoundations);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_WALL_MATERIALS_FA)
                .ifPresent(type::setCorrectMaterialsWall);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_FLOOR_MATERIALS_FA)
                .ifPresent(type::setCorrectCeilingMaterials);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_ROOF_MATERIALS_FA)
                .ifPresent(type::setCorrectRoofingMaterials);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_OTHER_INDICATORS_FA)
                .ifPresent(type::setOtherIndex);

        return type;
    }

    private ShortProjectObjectType shortProjectObjectType(IRecord rsoksPartRecord) {
        var type = new ShortProjectObjectType();
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_LAND_AREA)
                .ifPresent(type::setTotalArea);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_BUILDING_AREA)
                .ifPresent(type::setBuildingArea);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_BUILDING_AREA_OKS_PART)
                .ifPresent(type::setAreaObjectCap);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_BUILDING_AREA_OKS_PART)
                .ifPresent(type::setAreaBuildingPartObject);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_VOLUME)
                .ifPresent(type::setBuildingVolume);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_UNDERGROUND_PART)
                .ifPresent(type::setUndergroundPart);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_CAPACITY_FA)
                .ifPresent(type::setCapacity);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_HEIGHT_FA)
                .ifPresent(type::setHeightObject);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_MIN_NUMBER_FLOOR_FA)
                .ifPresent(type::setMinNumberFloors);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_MAX_NUMBER_FLOOR_FA)
                .ifPresent(type::setMaxNumberFloors);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_MIN_UNDERGROUND_FLOORS)
                .ifPresent(type::setMinUndergroundFloors);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_MAX_UNDERGROUND_FLOORS)
                .ifPresent(type::setMaxUndergroundFloors);

        return type;
    }

    private ProjectLongObjectsType projectLongObjectsType(IRecord rsoksPartRecord) {
        var type = new ProjectLongObjectsType();
        asRefBookType(rsoksPartRecord, FieldsRsoksPart.TABLE, FieldsRsoksPart.PROPERTY_LINE_OBJECT_CLASSES)
                .ifPresent(type::setCategory);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_LINE_OBJECT_LENGTH)
                .ifPresent(type::setExtension);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_LINE_OBJECT_LENGTH)
                .ifPresent(type::setLengthPart);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_LINE_OBJECT_POWER)
                .ifPresent(type::setPower);
        asRefBookType(rsoksPartRecord, FieldsRsoksPart.TABLE, FieldsRsoksPart.PROPERTY_POWER_MEASURE)
                .ifPresent(type::setPowerMeasure);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_PIPELINES_INFO_FA)
                .ifPresent(type::setPipeCharacteristics);
        asRefBookType(rsoksPartRecord, FieldsRsoksPart.TABLE, FieldsRsoksPart.PROPERTY_POWER_LINES_TYPE)
                .ifPresent(type::setPowerLinesType);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_POWER_LINES_LEVEL).
                ifPresent(type::setPowerLinesLevel);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_STRUCTURAL_ELEMENTS_SAFETY_FA)
                .ifPresent(type::setStructuralElements);
        asString(rsoksPartRecord, FieldsRsoksPart.PROPERTY_LINE_OBJECT_OTHER_INFO)
                .ifPresent(type::setOtherIndex);

        return type;
    }

    private InfoDocDescriptionType infoDocDescriptionType(IRecord rsoksRecord) {
        var type = new InfoDocDescriptionType();

        // StandardArchitecturalSolution
        asRefRecord(rsoksRecord, FieldsRsoks.PROPERTY_DL_DATA_TAR_DATA_CONNECTION)
                .map(this::standardArchitecturalSolutionDescriptionType)
                .ifPresentOrElse(tp -> {
                    type.getStandardArchitecturalSolutionDescription().add(tp);
                    type.setStandardArchitecturalSolutionAvailability(AvailabilityDocType.AVAILABLE);
                }, () -> {
                    type.setStandardArchitecturalSolutionAvailability(AvailabilityDocType.NOT_AVAILABLE);
                });

        // LandCadastral
        of(landCadastralDescriptionType(reusable.section13recordId))
                .ifPresentOrElse(tp -> {
                            type.getLandCadastralDescription().add(tp);
                            type.setLandCadastralAvailability(AvailabilityDocType.AVAILABLE);
                        },
                        () -> type.setLandCadastralAvailability(AvailabilityDocType.NOT_AVAILABLE));

        // Demarcation
        asRefRecord(rsoksRecord, FieldsRsoks.PROPERTY_DL_DATA_PPT_DATA_CONNECTION)
                .map(this::demarcationDescriptionType)
                .ifPresentOrElse(tp -> {
                            type.getDemarcationDescription().add(tp);
                            type.setDemarcationAvailability(AvailabilityDocType.AVAILABLE);
                        },
                        () -> type.setDemarcationAvailability(AvailabilityDocType.NOT_AVAILABLE)
                );

        // DevPlanLandPlot
        asRefRecord(rsoksRecord, FieldsRsoks.PROPERTY_DL_DATA_GPZU_DATA_CONNECTION)
                .map(this::devPlanLandPlotDescriptionType)
                .ifPresentOrElse(tp -> {
                            type.getDevPlanLandPlotDescription().add(tp);
                            type.setDevPlanLandPlotAvailability(AvailabilityDocType.AVAILABLE);
                        }, () -> type.setDevPlanLandPlotAvailability(AvailabilityDocType.NOT_AVAILABLE)
                );

        // EcologicalExpertise
        asRefRecord(rsoksRecord, FieldsRsoks.PROPERTY_DL_DATA_GECE_DATA_CONNECTION)
                .map(this::ecologicalExpertiseDescriptionType)
                .ifPresentOrElse(tp -> {
                    type.getEcologicalExpertiseDescription().add(tp);
                    type.setEcologicalExpertiseAvailability(AvailabilityDocType.AVAILABLE);
                }, () -> type.setEcologicalExpertiseAvailability(AvailabilityDocType.NOT_AVAILABLE));

        // ExpertiseProject
        asRefRecord(rsoksRecord, FieldsRsoks.PROPERTY_DL_DATA_UGE_DATA_CONNECTION)
                .map(this::expertiseProjectDocDescriptionType)
                .ifPresentOrElse(tp -> {
                            type.getExpertiseProjectDocDescription().add(tp);
                            type.setExpertiseProjectDocAvailability(AvailabilityDocType.AVAILABLE);
                        }, () -> type.setExpertiseProjectDocAvailability(AvailabilityDocType.NOT_AVAILABLE)
                );

        // ProjectDocumentation
        asRefRecord(rsoksRecord, FieldsRsoks.PROPERTY_DL_DATA_PROJECT_DOCUMENTATION_DESCRIPTION_CONNECTION)
                .map(this::projectDocumentationDescriptionType)
                .ifPresentOrElse(tp -> {
                            type.getProjectDocumentationDescription().add(tp);
                            type.setProjectDocumentationAvailability(AvailabilityDocType.AVAILABLE);
                        }, () -> type.setProjectDocumentationAvailability(AvailabilityDocType.NOT_AVAILABLE)
                );

        return type;
    }

    private ProjectDocumentationDescriptionType projectDocumentationDescriptionType(IRecord section18Record) {
        var type = new ProjectDocumentationDescriptionType();
        asString(section18Record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setProjectDocCode);
        asLocalDateTime(section18Record, FieldsSection.PROPERTY_DOC_DATE)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar)
                .ifPresent(type::setDocumentationDate);
        type.setOrganDocInfo(reusable.organDocInfo);

        return type;
    }

    private ExpertiseProjectDocDescriptionType expertiseProjectDocDescriptionType(IRecord ugeRecord) {
        var section13record = asRefRecord(ugeRecord, FieldsUge.PROPERTY_DL_DATA_SECTION13_DATA_CONNECTION)
                .orElseThrow(() -> SmevRequestException.recordNotFound("section13", null));
        var type = new ExpertiseProjectDocDescriptionType();
        asString(section13record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setExpertiseProjectDocNumber);
        asLocalDateTime(section13record, FieldsSection.PROPERTY_DOC_DATE)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar)
                .ifPresent(type::setExpertiseProjectDocDate);
//        if (stubAttachments == false) {
//            asFileRecord(section13record, FieldsSection.PROPERTY_FILE)
//                    .map(this::attachments)
//                    .ifPresent(file -> type.getAttachments().addAll(file));
//        }
        asRefBookType(ugeRecord, FieldsUge.TABLE, FieldsUge.PROPERTY_PROJECT_DOC_TYPE)
                .ifPresent(type::setProjectDocType);
        type.setOrganDocInfo(reusable.organDocInfo);

        return type;
    }

    private OrganDocInfoType organDocInfo_Organization(IRecord organizationRecord) {
        var type = new OrganDocInfoType();
        asBoolean(organizationRecord, FieldsOrganization.PROPERTY_IS_RESIDENT)
                .ifPresent(type::setIsResident);
        asString(organizationRecord, FieldsOrganization.PROPERTY_FULL_TITLE)
                .ifPresent(type::setOrganizationName);
        asString(organizationRecord, FieldsOrganization.PROPERTY_INN)
                .ifPresent(type::setINN);
        asString(organizationRecord, FieldsOrganization.PROPERTY_ORGN)
                .ifPresent(type::setOGRNCompany);
        asString(organizationRecord, FieldsOrganization.PROPERTY_ORGANIZATION_REG_NUMBER)
                .ifPresent(type::setOrganizationRegNumber);

        return type;
    }

    private EcologicalExpertiseDescriptionType ecologicalExpertiseDescriptionType(IRecord section13record) {
        var type = new EcologicalExpertiseDescriptionType();
        asString(section13record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setEcologicalExpertiseNumber);
        asLocalDateTime(section13record, FieldsSection.PROPERTY_DOC_DATE)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar)
                .ifPresent(type::setEcologicalExpertiseDate);

//        if (stubAttachments == false) {
//            asFileRecord(section13record, FieldsSection.PROPERTY_FILE)
//                    .map(this::attachments)
//                    .ifPresent(file -> type.getAttachments().addAll(file));
//        }

        asRefRecord(section13record, FieldsSection.PROPERTY_SUPPLIER_DATA_CONNECTION)
                .flatMap(record -> asRefRecord(record, FieldsSupplier.PROPERTY_ORGANIZATION_DATA_CONNECTION))
                .map(this::organDocInfo_Organization)
                .ifPresent(organDocInfoType -> {
                    // информация, полученные на этом шаге используется в других местах
                    reusable.organDocInfo.setOrganizationName(organDocInfoType.getOrganizationName());
                    reusable.organDocInfo.setOrganizationRegNumber(organDocInfoType.getOrganizationRegNumber());
                    reusable.organDocInfo.setOGRNCompany(organDocInfoType.getOGRNCompany());
                    reusable.organDocInfo.setINN(organDocInfoType.getINN());
                    reusable.organDocInfo.setOrganizationOPF(organDocInfoType.getOrganizationOPF());
                    reusable.organDocInfo.setIsResident(organDocInfoType.isIsResident());

                    type.setOrganDocInfo(reusable.organDocInfo);
                });

        return type;
    }

    private DevPlanLandPlotDescriptionType devPlanLandPlotDescriptionType(IRecord gpzuRecord) {
        var type = new DevPlanLandPlotDescriptionType();
        asString(gpzuRecord, FieldsGpzu.PROPERTY_LAND_PLOT_PLANNING_ORGANISATION_DOCS)
                .map(string -> {
                    var file = new FileType();
                    file.setName(string);
                    return file;
                })
                .ifPresent(file -> type.getLandPlotPlanningOrganisationDocs().add(file));
        asRefRecord(gpzuRecord, FieldsGpzu.PROPERTY_DL_DATA_SECTION13_DATA_CONNECTION)
                .ifPresent(section13record -> {

//                    if (stubAttachments == false) {
//                        asFileRecord(section13record, FieldsSection.PROPERTY_FILE)
//                                .map(this::attachments)
//                                .ifPresent(file -> type.getDevPlanLandPlotDocs().addAll(file));
//                    }

                    asLocalDateTime(section13record, FieldsSection.PROPERTY_DOC_DATE)
                            .map(LocalDateTime::toLocalDate)
                            .map(XmlMapper::mapCalendar)
                            .ifPresent(type::setDevPlanLandPlotDate);
                    asString(section13record, FieldsSection.PROPERTY_DOC_NUM)
                            .ifPresent(type::setDevPlanLandPlotNumber);
                    of(section13record.getId())
                            .map(this::landCadastralDescriptionType)
                            .ifPresent(tp -> type.getLandCadastralDescription().add(tp));
                });
        type.setOrganDocInfo(reusable.organDocInfo);

        return type;
    }

    private DemarcationDescriptionType demarcationDescriptionType(IRecord section7Record) {
        var type = new DemarcationDescriptionType();
        asRefBookType(section7Record, FieldsSection.TABLE_7, FieldsSection.PROPERTY_CONTENT_TYPE_ID)
                .ifPresent(type::setDocType);
        asRefBookType(section7Record, FieldsSection.TABLE_7, FieldsSection.PROPERTY_ADMINISTRATIVE_DOC_TYPE)
                .ifPresent(type::setAdministrativeDocType);
        asString(section7Record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setDemarcationNumber);
        asLocalDateTime(section7Record, FieldsSection.PROPERTY_DOC_DATE)
                .map(LocalDateTime::toLocalDate)
                .map(XmlMapper::mapCalendar)
                .ifPresent(type::setDemarcationDate);
        type.setOrganDocInfo(reusable.organDocInfo);

        return type;
    }

    private StandardArchitecturalSolutionDescriptionType standardArchitecturalSolutionDescriptionType(IRecord section18Record) {
        var type = new StandardArchitecturalSolutionDescriptionType();
        asString(section18Record, FieldsSection.PROPERTY_DOC_NAME)
                .ifPresent(type::setNameDoc);
        asString(section18Record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setStandArchSolutionCode);
        asLocalDateTime(section18Record, FieldsSection.PROPERTY_DOC_DATE)
                .map(LocalDateTime::getYear)
                .map(BigInteger::valueOf)
                .ifPresent(type::setStandArchSolutionYear);
        type.setOrganDocInfo(reusable.organDocInfo);

        return type;
    }

    private LandCadastralDescriptionType landCadastralDescriptionType(Long section13RecordId) {
        var landplotRecord = getRecordByJsonIdValue(
                ResourceType.FEATURE,
                FieldsLandplot.WORKSPACE,
                FieldsLandplot.SCHEMA,
                FieldsLandplot.TABLE,
                FieldsLandplot.PROPERTY_FILE,
                section13RecordId
        );

        var type = new LandCadastralDescriptionType();
        asString(landplotRecord, FieldsLandplot.PROPERTY_CADASTRALNUM).ifPresent(type::setCadastralNumberZU);
        asString(landplotRecord, FieldsLandplot.PROPERTY_AREA).ifPresent(type::setLandPlotArea);

//        if (stubAttachments == false) {
//            asFileRecord(landplotRecord, FieldsLandplot.PROPERTY_ATTACHMENTS)
//                    .map(this::attachments)
//                    .ifPresent(fileType -> type.getAttachments().addAll(fileType));
//        }

        return type;
    }


    private List<AttachmentHeaderType> attachmentHeaderTypeList() {
        var attachmentHeaderTypeList = attachments
                .values()
                .stream()
                .map(smevAttachment -> {
                    var type = new AttachmentHeaderType();
                    type.setId(smevAttachment.getAttachmentId().toString());
                    type.setFilePath(smevAttachment.getS3fileName());
                    return type;
                }).collect(Collectors.toList());
        if (!attachmentHeaderTypeList.isEmpty()) {
            return attachmentHeaderTypeList;
        } else {
            return null;
        }
    }

    private Optional<RefBookType> asRefBookType(IRecord record, String tableName, String fieldName) {
        return asRefType(record, tableName, fieldName)
                .map(valueTitle -> {
                    var refType = new RefBookType();
                    refType.setCode(valueTitle.getCode());
                    refType.setName(valueTitle.getName());
                    return refType;
                });
    }

    private Optional<StatusConstructionType> asStatus(IRecord record, String fieldName) {
        return asString(record, fieldName)
                .map(s -> {
                    switch (s) {
                        // Выдан
                        case "0С.1":
                            return StatusConstructionType.ISSUED;
                        //Действие прекращено
                        case "0С.2":
                            return StatusConstructionType.TERMINATED;
                        default:
                            throw new SmevRequestException("document status is undefined :" + s);
                    }
                });
    }

    /**
     * Порядок "фамилия имя отчество"
     */
    private static FIOType mapFio(String source) {
        if (source == null) {
            return null;
        }

        // Разбиваем на
        var strArr = new ArrayList<>(Arrays.asList(source.split(" ")));

        // добавляем недостающих элементов
        while (strArr.size() < 3) {
            strArr.add("_");
        }

        var fioType = new FIOType();
        fioType.setSurname(strArr.get(0));
        fioType.setName(strArr.get(1));
        fioType.setMiddleName(strArr.get(2));
        return fioType;
    }

    /**
     * Для хранения объектов, который будут переиспользоваться
     */
    private static class ReusableElements {
        // Ид корневой записи
        private Long section13recordId;

        // Сведения об организации, выдавшей документ
        private OrganDocInfoType organDocInfo = new OrganDocInfoType();
    }

    public static final NamespacePrefixMapper namespacePrefixMapper = new NamespacePrefixMapper() {
        @Override
        public String getPreferredPrefix(String urn, String s1, boolean b) {
            switch (urn) {
                case "urn://x-artefacts-uishc.domrf.ru/register-rns/1.0.10":
                    return "tns";
                case "urn://x-artefacts-uishc.domrf.ru/register-rns/commons/1.0.10":
                    return "com";
                case "urn://x-artefacts-smev-gov-ru/supplementary/commons/1.3.0":
                    return "smev";
                default:
                    return "typ";
            }
        }
    };
}
