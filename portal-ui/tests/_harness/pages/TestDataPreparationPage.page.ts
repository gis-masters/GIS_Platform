import { Page } from '../classes/Page';

class TestDataPreparationPage extends Page {
  title = 'Подготовка тестовых данных';
  url = 'test-data-preparation';

  selectors = {
    root: '.test-data-preparation'
  };
}

export const testDataPreparationPage = new TestDataPreparationPage();
