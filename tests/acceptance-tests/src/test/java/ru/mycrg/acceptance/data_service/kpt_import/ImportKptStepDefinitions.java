package ru.mycrg.acceptance.data_service.kpt_import;

import io.cucumber.java.en.Given;
import ru.mycrg.acceptance.BaseStepsDefinitions;

public class ImportKptStepDefinitions extends BaseStepsDefinitions {

    private final ImportKptDataCreator dataCreator = new ImportKptDataCreator();

    @Given("Подготовлены данные для импорта КПТ")
    public void prepareImportKptData() {
        dataCreator.prepareDataset();
        dataCreator.recreateTables();
        dataCreator.prepareDocumentWithKptFile();
        dataCreator.startImport();
        dataCreator.waitTillImportTaskIsDone();
    }
}
