package ru.mycrg.data_service.service.smev3.request.register_rns;

import ru.mycrg.data_service.register_rns_1_0_10.*;
import ru.mycrg.data_service.service.smev3.model.SmevRequestConst;
import ru.mycrg.data_service.util.xml.XmlMapper;

import java.math.BigInteger;
import java.time.LocalDate;

public class Stub {

    /**
     * временно заполняем того чего нет
     */
    public static void fillStubFields(Request request,
                                      RegisterRnsXmlBuildProcess.ReusableElements reusable) {
        var registerNewConstruction = request.getRegisterNewConstruction();

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
        addressFullType.setRegion(SmevRequestConst.CRIMEA_REGION);
        addressFullType.setFIAS("ef8f9fe1-bc9f-48ca-8219-92a87f8af4c7");
        addressFullType.setLocality(addressElementTypeCity);
        addressFullType.setStreet(addressElementType);
        addressFullType.setHouseNumber("23");
        addressFullType.setBuildingNumber("соор 1");
        addressFullType.setNote("295014 Симферополь, ул. Хромченко д 23, соор 1");
        addressFullType.setOKTMO("46771000001");
        addressFullType.setElementPlanStructure(refBookTypeRaion);

        registerNewConstruction.getRecipientInfo().setMailingAddress(addressFullType);

        //IssueOrgan
        var organizationInfoType = new OrganizationInfoType();
        organizationInfoType.setOGRN("1185053037476");
        organizationInfoType.setINN("5024190060");
        registerNewConstruction.setIssueOrgan(organizationInfoType);

        // IssuePerson
        var fioType = new FIOType();
        fioType.setMiddleName("Степанов");
        fioType.setName("Степанов");
        fioType.setSurname("Степанов");
        registerNewConstruction.setIssuePerson(fioType);

        // IssuePersonPosition
        registerNewConstruction.setIssuePersonPosition("Сотрудник");

        // ObjectInfo
        var objectInfo = registerNewConstruction.getObjectInfo().get(0);

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

}
