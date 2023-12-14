package unit.smev;

import org.junit.Test;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.service.smev3.get_cadastrial_plan.GetCadastrialPlanXmlBuildProcess;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class GetCadastrialPlanTest {

    @Test
    public void getEgrnCadastrialPlans_1_1_2(){
        var smev3Config = new Smev3Config();
        smev3Config.setMnemonicIS("mnemonic");
        var meta = new GetCadastrialPlanXmlBuildProcess(smev3Config)
                .run("request.xml",
                        "app_1.xml",
                        "Passport.pdf",
                        "Request.zip");
        assertNotNull(meta.getXmlString());
    }
}
