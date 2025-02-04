package ru.mycrg.data_service.service.smev3.request.terminate_rns;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.smev3.RegisterRequestDto;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.smev3.fields.FieldsCustomer;
import ru.mycrg.data_service.service.smev3.model.RequestAndSources;
import ru.mycrg.data_service.service.smev3.request.AXmlBuildProcessor;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.terminate_rns_1_0_6.OrganizationInfoType;
import ru.mycrg.data_service.terminate_rns_1_0_6.RefBookType;
import ru.mycrg.data_service.terminate_rns_1_0_6.Request;

import java.math.BigInteger;
import java.util.Optional;

import static java.util.Optional.of;
import static ru.mycrg.data_service.service.smev3.fields.FieldsOrganization.*;
import static ru.mycrg.data_service.service.smev3.fields.FieldsSection.*;

public class TerminateRnsXmlBuildProcessor extends AXmlBuildProcessor {

    private static final Logger log = LoggerFactory.getLogger(TerminateRnsXmlBuildProcessor.class);

    // юридическое лицо
    private static final BigInteger LEGAL_ENTITY = new BigInteger("1");

    private final ReusableElements rue = new ReusableElements();

    public TerminateRnsXmlBuildProcessor(RequestProcessor requestProcessor) {
        super(requestProcessor);
    }

    public RequestAndSources<Request> run(@NotNull RegisterRequestDto dto) {
        try {
            loadRecords(dto.getRecId());

            // бизнес часть запроса
            Request request = buildRequest();

            return buildRequest(request);
        } catch (Exception e) {
            throw new SmevRequestException("Ошибка при построении запрос в СМЭВ: " + e.getMessage());
        }
    }

    private void loadRecords(Long section13Id) {
        // section13Record
        rue.section13Record = getRecordById(
                TABLE_13,
                TABLE_13,
                section13Id
        );
        log.debug("section13Record прочитано - {}", rue.section13Record != null);

        rue.relation_Section13Record = asRefRecord(
                rue.section13Record,
                PROPERTY_RELATIONS
        ).orElse(null);
        log.debug("relation_Section13Record прочитано - {}", rue.relation_Section13Record != null);

        rue.organization2_Section13Record = asRefRecord(
                rue.section13Record,
                PROPERTY_ORGANIZATION_2
        ).orElse(null);
        log.debug("termination_Section13Record прочитано - {}", rue.organization2_Section13Record != null);

        rue.developer_CustomerRecord = asRefRecord(
                rue.relation_Section13Record,
                PROPERTY_DEVELOPER_DATA_CONNECTION
        ).orElse(null);
        log.debug("developer_CustomerRecord прочитано - {}", rue.developer_CustomerRecord != null);

        // developer_CustomerRecord
        rue.developerOrganizationRecord = asRefRecord(
                rue.developer_CustomerRecord,
                FieldsCustomer.PROPERTY_ORGANIZATION
        ).orElse(null);
        log.debug("developerOrganizationRecord прочитано - {}", rue.developerOrganizationRecord != null);
    }

    /**
     * Корневая сущность
     */
    private Request buildRequest() {
        Request request = new Request();

        of(LEGAL_ENTITY)
                .ifPresent(request::setUserType);

        // section13Record
        asString(rue.section13Record, PROPERTY_DOC_NUM)
                .ifPresent(request::setNumber);
        asXMLGregorianCalendar(rue.section13Record, PROPERTY_DOC_DATE)
                .ifPresent(request::setTerminationDate);
        asString(rue.section13Record, PROPERTY_DETAIL)
                .ifPresent(request::setDetail);
        asString(rue.section13Record, PROPERTY_CANCELED_DOC_NUMBER)
                .ifPresent(request::setCanceledDocNumber);
        asXMLGregorianCalendar(rue.section13Record, PROPERTY_CANCELED_DOC_DATE)
                .ifPresent(request::setCanceledDocDate);
        asXMLGregorianCalendar(rue.section13Record, PROPERTY_CANCELED_DOC_DATE)
                .ifPresent(request::setCanceledDocDate);
        asRefBookType(rue.section13Record)
                .ifPresent(request::setTerminationBasis);

        // relation_Section13Record
        asString(rue.relation_Section13Record, PROPERTY_IDENTIFIER)
                .ifPresent(request::setConstPermitID);
        asString(rue.relation_Section13Record, PROPERTY_DOC_NUM)
                .ifPresent(request::setConstPermitNumber);
        asXMLGregorianCalendar(rue.relation_Section13Record, PROPERTY_DOC_DATE)
                .ifPresent(request::setConstPermitDate);
        asXMLGregorianCalendar(rue.relation_Section13Record, PROPERTY_VALID_UNTIL)
                .ifPresent(request::setConstPermitExpireDate);

        // organization2_Section13Record
        asString(rue.organization2_Section13Record, PROPERTY_FULL_TITLE)
                .ifPresent(request::setOrganizationName);
        asString(rue.organization2_Section13Record, PROPERTY_INN)
                .ifPresent(request::setOrganizationINN);

        request.setIssueOrgan(prepareIssueOrgan());

        return request;
    }

    private OrganizationInfoType prepareIssueOrgan() {
        OrganizationInfoType infoType = new OrganizationInfoType();
        asString(rue.developerOrganizationRecord, PROPERTY_FULL_TITLE)
                .ifPresent(infoType::setOrganizationName);
        asString(rue.developerOrganizationRecord, PROPERTY_ORGN)
                .ifPresent(infoType::setOGRN);
        asString(rue.developerOrganizationRecord, PROPERTY_INN)
                .ifPresent(infoType::setINN);
        asString(rue.developerOrganizationRecord, PROPERTY_KPP)
                .ifPresent(infoType::setKPP);

        return infoType;
    }

    private Optional<RefBookType> asRefBookType(IRecord record) {
        return asRefType(record, TABLE_13, PROPERTY_TERMINATION_REASON_EIS)
                .map(valueTitle -> {
                    RefBookType refType = new RefBookType();
                    refType.setCode(valueTitle.getCode());
                    refType.setName(valueTitle.getName());

                    return refType;
                });
    }

    /**
     * Для хранения объектов, который будут переиспользоваться
     */
    static class ReusableElements {

        private IRecord section13Record;
        private IRecord relation_Section13Record;
        private IRecord organization2_Section13Record;
        private IRecord developer_CustomerRecord;
        private IRecord developerOrganizationRecord;
    }
}
