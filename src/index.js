import Feact from './Feact';
import MyTitle from './test';


Feact.render(
  Feact.createElement(MyTitle, { asTitle: true, msg: 'hey there Feact'}),
  document.getElementById('root')
);
