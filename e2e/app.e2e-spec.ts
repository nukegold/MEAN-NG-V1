import { MeanNgV1Page } from './app.po';

describe('mean-ng-v1 App', () => {
  let page: MeanNgV1Page;

  beforeEach(() => {
    page = new MeanNgV1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
