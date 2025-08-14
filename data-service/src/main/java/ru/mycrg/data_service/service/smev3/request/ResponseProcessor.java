package ru.mycrg.data_service.service.smev3.request;

import org.apache.commons.lang3.NotImplementedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;

public class ResponseProcessor {

    private static final Logger log = LoggerFactory.getLogger(ResponseProcessor.class);

    private final Mnemonic mnemonic;

    public ResponseProcessor(Mnemonic mnemonic) {
        this.mnemonic = mnemonic;
    }

    @Transactional
    public ProcessAdapterMessageResult processMessageFromSmev(String messageBody) {
        log.debug("processMessageFromSmev: {}", messageBody);

        throw new NotImplementedException("not implemented");
    }

    public Mnemonic mnemonicEnum() {
        return mnemonic;
    }
}
