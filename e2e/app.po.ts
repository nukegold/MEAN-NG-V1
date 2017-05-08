import { browser, element, by } from 'protractor';

export class MeanNgV1Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('.panel-title')).getText();
  }
}
