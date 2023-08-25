package ru.crg.gisogd_service.test.route.bean;

import org.apache.camel.Handler;
import org.springframework.stereotype.Component;
import ru.crg.gisogd_service.model.rf.InboxData;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Description.
 * @author Vladimir Nomokonov
 */
@Component("testInboxDataBean")
public class TestInboxDataBean {

    @Handler
    public InboxData testInboxDataBean() {
        return getInboxData(UUID.fromString("11111111-2222-3333-4444-123456789101"));
    }

    private InboxData getInboxData(UUID guid) {
        InboxData inboxData = new InboxData();
        //        inboxData.setGuid(UUID.randomUUID());
        inboxData.setGuid(guid.toString());
        inboxData.setNumber("number");
        inboxData.setDate(LocalDate.now());
        inboxData.setPersonName("Организация ООО");
        inboxData.setRequestType("0B.1");
        inboxData.setDataType("0E.2");
        inboxData.recordStatus("1.A.1");
        inboxData.setUserName("user@name.ru");
        inboxData.setIsName("some name");
        inboxData.setCoverLetterDate(LocalDate.now());
        inboxData.setCoverLetterNum("20072023");

        return inboxData;
    }
}
