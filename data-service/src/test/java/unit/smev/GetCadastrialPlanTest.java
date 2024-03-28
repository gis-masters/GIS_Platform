package unit.smev;

import org.junit.Test;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.Request;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.GetCadastrialPlanRequestService;
import ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.GetCadastrialPlanXmlBuildProcess;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import javax.xml.bind.JAXBException;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class GetCadastrialPlanTest {

    private final XmlMarshaller marshaller = new XmlMarshaller(Mnemonic.GET_CADASTRIAL_PLAN_1_1_2.getPrefixMapper());

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

        var meta = new GetCadastrialPlanXmlBuildProcess(processor).run();

        // to xml
        var requestXmlStrong = marshaller.marshall(meta.getRequest(), Request.class);

        // to object
        var requestObject = marshaller.unmarshall(requestXmlStrong, Request.class);

        assertNotNull(requestObject);
    }
}
