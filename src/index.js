import Feact from './Feact';
import { MyTitle, MyComponent } from './test';


Feact.render(
  Feact.createElement(MyComponent),
  document.getElementById('root')
);
