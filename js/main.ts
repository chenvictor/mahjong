import {UI} from './ui';

const BUTTON_WIN = 'Win';
const BUTTON_3KIND = '3 Kind';
const BUTTON_4KIND = '4 Kind';
const BUTTON_THROW = 'Throw';
const BUTTON_CANCEL = 'Cancel';

(async () => {
  const ui = await UI.create('container');
  const cards = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
  ui.setHand(cards);
  ui.on('click', ((tile, idx) => {
    console.log({
      tile, idx
    });
  }));
  ui.select(3).then((selected) => {
    console.log(selected);
  }).catch(() => {
    console.log('no');
  });
})();

