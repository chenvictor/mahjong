import Konva from 'konva';

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
export const MESSAGE_SIZE = 24;
const BUTTON_BG_COLOR = 'gray';
const BUTTON_BG_HIGHLIGHT = 'white';

const makeButton = (config: ButtonConfig, pos: Konva.Vector2d): Konva.Label => {
  const kLabel = new Konva.Label({
    ...pos,
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
};

export class Menu {
  private readonly layer: Konva.Layer;
  private readonly group: Konva.Group;
  private readonly btnGroup: Konva.Group;
  private readonly text: Konva.Text;

  constructor(layer: Konva.Layer, config: MenuConfig) {
    this.layer = layer;
    this.group = new Konva.Group({
      draggable: true,
      ...config,
    });
    this.btnGroup = new Konva.Group();
    this.layer.add(this.group);
    this.group.add(this.btnGroup);
    this.text = new Konva.Text({
      fontSize: MESSAGE_SIZE,
      y: BUTTON_HEIGHT,
    });
    this.group.add(this.text);
  }

  public setButtons(buttons: ButtonConfig[]) {
    this.btnGroup.destroyChildren();
    for (let i = 0; i < buttons.length; ++i) {
      const button = makeButton(buttons[i], {
        x: i * BUTTON_WIDTH,
        y: 0,
      });
      this.btnGroup.add(button);
    }
    this.layer.draw();
  }

  public showMessage(message: string) {
    this.text.text(message);
    this.layer.draw();
  }
}
