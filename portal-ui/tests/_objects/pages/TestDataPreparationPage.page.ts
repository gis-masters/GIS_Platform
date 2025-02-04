import { Page } from '../Page';

class TestDataPreparationPage extends Page {
  title = 'Подготовка тестовых данных';
  url = 'test-data-preparation';

  selectors = {
    container: '.test-data-preparation'
  };
}

export const testDataPreparationPage = new TestDataPreparationPage();
