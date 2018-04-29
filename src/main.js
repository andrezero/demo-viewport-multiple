import { style } from './styles/style.css'; // eslint-disable-line no-unused-vars
import { Application } from './application';

const init = () => {
  const loaderElement = document.getElementById('loading');
  const parentElement = document.getElementById('app-container');
  const app = new Application(parentElement);

  loaderElement.remove();
  window.addEventListener('resize', () => app.resize());
};

document.addEventListener('DOMContentLoaded', init);
