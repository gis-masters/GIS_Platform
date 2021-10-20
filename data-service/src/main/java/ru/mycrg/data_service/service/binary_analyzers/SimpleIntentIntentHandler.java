package ru.mycrg.data_service.service.binary_analyzers;

import org.jetbrains.annotations.Contract;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.IRecord;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.FILE_TYPE;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.INTENTS;

@Component
public class SimpleIntentIntentHandler implements IBinaryIntentHandler {

    @Override
    @Contract(mutates = "this")
    public void updateIntents(IRecord record) {
        String fileType = String.valueOf(record.getContent().get(FILE_TYPE.getName()));
        if (fileType.equals("gml")) {
            record.setValue(INTENTS.getName(), "PROJECT");
        }
    }
}
