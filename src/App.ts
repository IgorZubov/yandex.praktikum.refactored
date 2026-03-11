import CreatePage from './pages/createPage/CreatePage';
import AnswerPage from './pages/answerPage/AnswerPage';
import { mockQuestions } from './mockData';

export default class App {
  private state = {
    currentPage: 'createQuestionnaire',
    questions: [] as string[],
  };

  private appElement: HTMLElement;

  constructor() {
    this.appElement = document.getElementById('app')!;
  }

  render() {
    this.appElement.innerHTML = '';

    let page: CreatePage | AnswerPage;

    if (this.state.currentPage === 'createQuestionnaire') {
      page = new CreatePage({
        questions: this.state.questions,
        createButtonEnabled: this.state.questions.length === 0,
        onAddQuestion: (q: string) => this.addQuestion(q),
        onCreateQuestionnaire: () => this.createQuestionnaire(),
        onChangePage: (p: string) => this.changePage(p),
      });
    } else {
      page = new AnswerPage({
        questions: mockQuestions,
        answerOptions: ['Yes', 'No', 'Maybe'],
        onChangePage: (p: string) => this.changePage(p),
        onSubmit: () => this.submitAnswers(),
      });
    }

    this.appElement.appendChild(page.element()!);
  }

  private addQuestion(question: string) {
    this.state.questions.push(question);
    this.render();
  }

  private createQuestionnaire() {
    if (this.state.questions.length > 0) {
      this.changePage('answerQuestionnaire');
    }
  }

  private changePage(page: string) {
    this.state.currentPage = page;
    this.render();
  }

  private submitAnswers() {
    alert('Answers submitted!');
  }
}
