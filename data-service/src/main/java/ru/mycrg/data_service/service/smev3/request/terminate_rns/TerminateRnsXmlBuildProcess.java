package ru.mycrg.data_service.service.smev3.request.terminate_rns;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.smev3.TerminateRnsRequestDto;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.smev3.fields.FieldsCustomer;
import ru.mycrg.data_service.service.smev3.fields.FieldsOrganization;
import ru.mycrg.data_service.service.smev3.fields.FieldsSection;
import ru.mycrg.data_service.service.smev3.model.BuildRequestAndSources;
import ru.mycrg.data_service.service.smev3.request.AXmlBuildProcess;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.service.smev3.request.register_rnv.RegisterRnvXmlBuildProcess;
import ru.mycrg.data_service.terminate_rns_1_0_6.OrganizationInfoType;
import ru.mycrg.data_service.terminate_rns_1_0_6.RefBookType;
import ru.mycrg.data_service.terminate_rns_1_0_6.Request;

import java.math.BigInteger;
import java.util.Optional;

import static java.util.Optional.of;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;

public class TerminateRnsXmlBuildProcess extends AXmlBuildProcess {
    private final Logger log = LoggerFactory.getLogger(RegisterRnvXmlBuildProcess.class);
    private final ReusableElements rue = new ReusableElements();
    private static final BigInteger LEGAL_ENTITY = new BigInteger("1");

    public TerminateRnsXmlBuildProcess(RequestProcessor requestProcessor) {
        super(requestProcessor);
    }

    public BuildRequestAndSources<Request> run(@NotNull TerminateRnsRequestDto dto) {
        try {
            loadRecords(dto.getRecId());

            // бизнес часть запроса
            var request = requestType();

            return buildRequest(request);
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }

    private void loadRecords(Long section13Id) {
        // section13Record
        rue.section13Record = getRecordById(
                LIBRARY_RECORD,
                SYSTEM_SCHEMA_NAME,
                FieldsSection.TABLE_13,
                FieldsSection.TABLE_13,
                section13Id
        );
        log.debug("section13Record read. is not null {}", rue.section13Record != null);

        rue.relation_Section13Record = asRefRecord(
                rue.section13Record,
                FieldsSection.PROPERTY_RELATIONS
        ).orElse(null);
        log.debug("relation_Section13Record read. is not null {}", rue.relation_Section13Record != null);

        rue.organization2_Section13Record = asRefRecord(
                rue.section13Record,
                FieldsSection.PROPERTY_ORGANIZATION_2
        ).orElse(null);
        log.debug("termination_Section13Record read. is not null {}", rue.organization2_Section13Record != null);

        rue.developer_CustomerRecord = asRefRecord(
                rue.relation_Section13Record,
                FieldsSection.PROPERTY_DEVELOPER_DATA_CONNECTION
        ).orElse(null);
        log.debug("developer_CustomerRecord read. is not null {}", rue.developer_CustomerRecord != null);

        // developer_CustomerRecord
        rue.developerOrganizationRecord = asRefRecord(
                rue.developer_CustomerRecord,
                FieldsCustomer.PROPERTY_ORGANIZATION
        ).orElse(null);
        log.debug("developerOrganizationRecord read. is not null {}", rue.developerOrganizationRecord != null);

    }

    /**
     * Корневая сущность
     */
    private Request requestType() {
        var type = new Request();

        of(LEGAL_ENTITY)
                .ifPresent(type::setUserType);

        // section13Record
        asString(rue.section13Record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setNumber);
        asXMLGregorianCalendar(rue.section13Record, FieldsSection.PROPERTY_DOC_DATE)
                .ifPresent(type::setTerminationDate);
        asString(rue.section13Record, FieldsSection.PROPERTY_DETAIL)
                .ifPresent(type::setDetail);
        asString(rue.section13Record, FieldsSection.PROPERTY_CANCELED_DOC_NUMBER)
                .ifPresent(type::setCanceledDocNumber);
        asXMLGregorianCalendar(rue.section13Record, FieldsSection.PROPERTY_CANCELED_DOC_DATE)
                .ifPresent(type::setCanceledDocDate);
        asXMLGregorianCalendar(rue.section13Record, FieldsSection.PROPERTY_CANCELED_DOC_DATE)
                .ifPresent(type::setCanceledDocDate);
        asRefBookType(rue.section13Record, FieldsSection.TABLE_13, FieldsSection.PROPERTY_TERMINATION_REASON_EIS)
                .ifPresent(type::setTerminationBasis);

        // relation_Section13Record
        asString(rue.relation_Section13Record, FieldsSection.PROPERTY_IDENTIFIER)
                .ifPresent(type::setConstPermitID);
        asString(rue.relation_Section13Record, FieldsSection.PROPERTY_DOC_NUM)
                .ifPresent(type::setConstPermitNumber);
        asXMLGregorianCalendar(rue.relation_Section13Record, FieldsSection.PROPERTY_DOC_DATE)
                .ifPresent(type::setConstPermitDate);
        asXMLGregorianCalendar(rue.relation_Section13Record, FieldsSection.PROPERTY_VALID_UNTIL)
                .ifPresent(type::setConstPermitExpireDate);

        // organization2_Section13Record
        asString(rue.organization2_Section13Record, FieldsOrganization.PROPERTY_FULL_TITLE)
                .ifPresent(type::setOrganizationName);
        asString(rue.organization2_Section13Record, FieldsOrganization.PROPERTY_INN)
                .ifPresent(type::setOrganizationINN);

        type.setIssueOrgan(issueOrgan());
        return type;
    }


    private OrganizationInfoType issueOrgan() {
        var type = new OrganizationInfoType();
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_FULL_TITLE)
                .ifPresent(type::setOrganizationName);
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_ORGN)
                .ifPresent(type::setOGRN);
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_INN)
                .ifPresent(type::setINN);
        asString(rue.developerOrganizationRecord, FieldsOrganization.PROPERTY_KPP)
                .ifPresent(type::setKPP);
        return type;
    }

    private Optional<RefBookType> asRefBookType(IRecord record,
                                                String tableName,
                                                String fieldName) {
        return asRefType(record, tableName, fieldName)
                .map(valueTitle -> {
                    var refType = new RefBookType();
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
