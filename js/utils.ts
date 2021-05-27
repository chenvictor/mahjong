import Konva from 'konva';

export const clamp = (val: number, min: number, max: number): number => Math.max(Math.min(val, max), min);

export const cleanInput = (msg: string): string => {
  return msg.replace(/\s+/g, '');
}

export const centerShapeHorizontal = (text: Konva.Shape): Konva.Shape => {
  const offset = text.width()/2 * text.scaleX();
  switch (text.rotation()) {
    case 0:
      text.x(text.x() - offset/2);
      break;
    case 270:
      text.y(text.y() + offset/2);
      break;
    case 90:
      text.y(text.y() - offset/2);
      break;
    default:
      console.error('invalid rotation to center');
  }
  return text;
}
