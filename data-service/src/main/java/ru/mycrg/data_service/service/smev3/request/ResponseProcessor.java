package ru.mycrg.data_service.service.smev3.request;

import org.apache.commons.lang3.NotImplementedException;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.service.schemas.ISchemaService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.util.xml.XmlMarshaller;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.Optional;

import static java.util.Optional.ofNullable;

public class ResponseProcessor {
    private final Mnemonic mnemonic;
    private final XmlMarshaller marshaller;
    private final RecordsDao recordsDao;
    private final ISchemaService schemaService;

    public ResponseProcessor(Mnemonic mnemonic,
                             RecordsDao recordsDao,
                             ISchemaService schemaService) {
        this.mnemonic = mnemonic;
        this.marshaller = new XmlMarshaller(mnemonic.getPrefixMapper());
        this.recordsDao = recordsDao;
        this.schemaService = schemaService;
    }

    @Transactional
    public ProcessAdapterMessageResult processMessageFromSmev(String messageBody) {
        throw new NotImplementedException("not implemented");
    }
    public Mnemonic mnemonicEnum() {
        return mnemonic;
    }

    public XmlMarshaller xmlMarshaller() {
        return marshaller;
    }

    public RecordsDao getRecordsDao() {
        return recordsDao;
    }

    public ISchemaService schemaService() {
        return schemaService;
    }

    public Optional<SchemaDto> getSchema(String schemaName) {
       return schemaService().getSchemaByName(schemaName);
    }
}
