package ru.mycrg.data_service.service.smev3.request;

import org.apache.commons.lang3.NotImplementedException;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

public class ResponseProcessor {

    private final Mnemonic mnemonic;
    private final XmlMarshaller marshaller;

    public ResponseProcessor(Mnemonic mnemonic) {
        this.mnemonic = mnemonic;
        this.marshaller = new XmlMarshaller(mnemonic.getPrefixMapper());
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
}
