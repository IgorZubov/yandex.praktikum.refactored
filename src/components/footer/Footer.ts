import Block from '../../framework/Block';

export default class Footer extends Block {
  static componentName = 'Footer';

  protected template = `
    <footer class="footer">
      {{Link href="#" class="footer-link" data-page="createQuestionnaire" text="Create Questionnaire"}}
      {{Link href="#" class="footer-link" data-page="answerQuestionnaire" text="Answer Questionnaire"}}
    </footer>
  `;
}
