import Block from '../../framework/Block';

export default class Footer extends Block {
  static componentName = 'Footer';

  protected template = `
    <footer class="footer">
      {{Link href="/" class="footer-link" text="Create Questionnaire"}}
      {{Link href="/answers" class="footer-link" text="Answer Questionnaire"}}
    </footer>
  `;
}
