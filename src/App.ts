import CreatePage from './pages/createPage/CreatePage';
import AnswerPage from './pages/answerPage/AnswerPage';
import { mockQuestions } from './mockData';
import Router from './framework/Router';

export default class App {
  private state = {
    currentPage: 'createQuestionnaire',
    questions: [] as string[],
  };

  private appElement: HTMLElement;
  private router: Router;

  constructor() {
    this.appElement = document.getElementById('app')!;
    this.router = new Router();

    this.router
      .use('/', () => {
        this.state.currentPage = 'createQuestionnaire';
        this.renderPage();
      })
      .use('/answers', () => {
        this.state.currentPage = 'answerQuestionnaire';
        this.renderPage();
      })
      .onNotFound(() => {
        this.router.go('/');
      });
  }

  render() {
    this.router.start();
  }

  private renderPage() {
    this.appElement.innerHTML = '';

    let page: CreatePage | AnswerPage;

    if (this.state.currentPage === 'createQuestionnaire') {
      page = new CreatePage({
        questions: this.state.questions,
        createButtonEnabled: this.state.questions.length === 0,
        onAddQuestion: (q: string) => this.addQuestion(q),
        onCreateQuestionnaire: () => this.createQuestionnaire(),
        onNavigate: (path: string) => this.router.go(path),
      });
    } else {
      page = new AnswerPage({
        questions: mockQuestions,
        answerOptions: ['Yes', 'No', 'Maybe'],
        onNavigate: (path: string) => this.router.go(path),
        onSubmit: () => this.submitAnswers(),
      });
    }

    this.appElement.appendChild(page.element()!);
  }

  private addQuestion(question: string) {
    this.state.questions.push(question);
    this.router.go('/');
  }

  private createQuestionnaire() {
    if (this.state.questions.length > 0) {
      this.router.go('/answers');
    }
  }

  private submitAnswers() {
    alert('Answers submitted!');
  }
}
