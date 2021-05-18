import {UI} from './ui';

(async () => {
  const ui = await UI.create('container');
  const cards = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
  ui.setHandTiles(0, cards);
  ui.select(3).then((selected) => {
    console.log(selected);
  }).catch(() => {
    console.log('no');
  });
})();

