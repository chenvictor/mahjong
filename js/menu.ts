import Konva from "konva";

type MenuConfig = {
  x: number;
  y: number;
};

type MenuButtonHandler = () => void;

type ButtonConfig = {
  text: string;
  color: any;
  handler: MenuButtonHandler;
};

export const BUTTON_WIDTH = 80;
export const BUTTON_HEIGHT = 80;
const BUTTON_BG_COLOR = 'gray';
const BUTTON_BG_HIGHLIGHT = 'white';

const makeButton = (config: ButtonConfig, pos: Konva.Vector2d): Konva.Label => {
  console.log(config);
  const kLabel = new Konva.Label({
    ...pos
  });
  const kTag = new Konva.Tag({
    fill: BUTTON_BG_COLOR,
  });
  const kText = new Konva.Text({
    text: config.text,
    fontSize: 70,
    fill: config.color,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    align: 'center',
    padding: 5,
  });
  kLabel.add(kTag).add(kText);
  kLabel.on('mouseover', () => {
    document.body.style.cursor = 'pointer';
    kTag.fill(BUTTON_BG_HIGHLIGHT);
    kLabel.draw();
  });
  kLabel.on('mouseout', () => {
    document.body.style.cursor = 'default';
    kTag.fill(BUTTON_BG_COLOR);
    kLabel.draw();
  });
  kLabel.on('click', config.handler);
  return kLabel;
}

export class Menu {
  private readonly layer: Konva.Layer;
  private readonly group: Konva.Group;
  constructor(layer: Konva.Layer, config: MenuConfig) {
    this.layer = layer;
    this.group = new Konva.Group({
      draggable: true,
      ...config
    });
    this.layer.add(this.group);
  }
  public setButtons(buttons: ButtonConfig[]) {
    this.group.destroyChildren();
    for (let i=0; i < buttons.length; ++i) {
      const button = makeButton(buttons[i], {
        x: i*BUTTON_HEIGHT,
        y: 0,
      });
      this.group.add(button);
    }
    this.layer.draw();
  }
}
