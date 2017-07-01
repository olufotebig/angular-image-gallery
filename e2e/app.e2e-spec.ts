import { ImageGalleryPage } from './app.po';

describe('image-gallery App', () => {
  let page: ImageGalleryPage;

  beforeEach(() => {
    page = new ImageGalleryPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
