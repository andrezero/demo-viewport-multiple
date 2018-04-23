import { style } from './styles/style.css';
import { Application } from './application';

const init = () => {
  const parentElement = document.getElementById('app-container');
  const app = new Application(parentElement);

  window.addEventListener('resize', () => app.resize());
};

document.addEventListener('DOMContentLoaded', init);
