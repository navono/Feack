import Feact from './Feact';
import MyTitle from './test';


Feact.render(
  Feact.createElement(MyTitle, { asTitle: true, msg: 'hey there Feact'}),
  document.getElementById('root')
);

Feact.render(
  Feact.createElement(MyTitle, { asTitle: false, msg: 'this is a paragraph'}),
  document.getElementById('root2')
);

Feact.render(
  Feact.createElement('button', null, 'primitive element'),
  document.getElementById('root2')
);
