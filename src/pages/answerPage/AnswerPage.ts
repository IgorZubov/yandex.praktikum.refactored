import Block from '../../framework/Block';
import type { BlockOwnProps } from '../../framework/Block';

interface AnswerPageProps extends BlockOwnProps {
  questions?: string[];
  answerOptions?: string[];
  onChangePage?: (page: string) => void;
  onSubmit?: () => void;
}

export default class AnswerPage extends Block<AnswerPageProps> {
  protected template = `
    <div class="app">
      <h1>Answer Questionnaire</h1>
      <div class="answer-questionnaire">
        {{#each questions}}
          <div class="question">
            <p>{{this}}</p>
            {{Select id=(concat "answer-" @index) options=../answerOptions}}
          </div>
        {{/each}}
        {{Button id="submit-answers" text="Submit Answers"}}
      </div>
      {{Footer}}
    </div>
  `;

  protected events = {
    click: (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.id === 'submit-answers') {
        this.props.onSubmit?.();
      } else if (target.dataset.page) {
        e.preventDefault();
        this.props.onChangePage?.(target.dataset.page);
      }
    },
  };
}
