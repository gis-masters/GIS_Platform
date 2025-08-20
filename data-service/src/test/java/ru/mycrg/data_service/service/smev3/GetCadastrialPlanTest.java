package ru.mycrg.data_service.service.smev3;

import org.junit.Test;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.Request;
import ru.mycrg.data_service.service.smev3.config.Smev3Config;
import ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.GetCadastrialPlanRequestService;
import ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.GetCadastrialPlanXmlBuildProcessor;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import javax.xml.bind.JAXBException;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class GetCadastrialPlanTest {

    @Test
    public void getEgrnCadastrialPlans_1_1_2() throws JAXBException {
        var smev3Config = new Smev3Config();
        smev3Config.setSystemMnemonic("mnemonic");

        var processor = new GetCadastrialPlanRequestService(smev3Config,
                null,
                null,
                null,
                null,
                null,
                null,
                null, null, null, null);

        var meta = new GetCadastrialPlanXmlBuildProcessor(processor).run();

        // to xml
        var requestXmlStrong = XmlMarshaller.marshall(meta.getRequest(), Request.class,
                                                   Mnemonic.GET_CADASTRIAL_PLAN_1_1_2.getPrefixMapper());

        // to object
        var requestObject = XmlMarshaller.unmarshall(requestXmlStrong, Request.class);

        assertNotNull(requestObject);
    }
}
