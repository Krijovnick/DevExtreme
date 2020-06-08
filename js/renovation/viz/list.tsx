import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import Item from './item';

const CURSOR = 'pointer';
const RADIUS = 4;
const ITEM_HEIGHT = 30;
const INDENT = 5;

export const viewFunction = ({
  props: {
    x, y, itemWidth, items, color, stroke, offset,
  },
}: List) => (
  <g>
    <rect
      x={x}
      y={offset + INDENT + y}
      width={itemWidth}
      height={ITEM_HEIGHT * items!.length}
      cursor={CURSOR}
      strokeWidth={1}
      rx={RADIUS}
      ry={RADIUS}
      fill={color}
      stroke={stroke}
    />
    {
        items!.map((item, index) => (
          <Item
            itemText={item}
            x={x}
            y={offset + INDENT + index * ITEM_HEIGHT}
            itemWidth={itemWidth}
            itemHeight={ITEM_HEIGHT}
          />
        ))
    }
  </g>
);

@ComponentBindings()
export class ListProps {
  @OneWay() x?: number = 0;

  @OneWay() y?: number = 0;

  @OneWay() itemWidth?: number = 119;

  @OneWay() items?: Array<string> = ['Print', 'PNG file', 'JPEG file', 'PDF file', 'SVG file'];

  @OneWay() color?: string = '#ffffff';

  @OneWay() stroke?: string = '#ddd';

  @OneWay() offset?: number = 0;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class List extends JSXComponent<ListProps> {

}
