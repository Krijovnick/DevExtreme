import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';

const POINTER_EVENTS = 'all';

export const viewFunction = ({
  props: {
    x, y, itemWidth, itemHeight, itemText, textStyle,
  },
}: Item) => (
  <g>
    <rect
      x={x}
      y={y}
      fill="#ffffff"
      width={itemWidth}
      height={itemHeight}
      pointerEvents={POINTER_EVENTS}
    />
    <text
      x={15}
      y={y + 15}
      alignmentBaseline="middle"
      fill={textStyle!.fill}
      fontWeight={textStyle!.fontWeight}
      fontSize={textStyle!.fontSize}
      fontFamily={textStyle!.fontFamily}
    >
      {itemText}
    </text>
  </g>
);

@ComponentBindings()
export class ItemProps {
  @OneWay() x?: number = 0;

  @OneWay() y?: number = 0;

  @OneWay() itemWidth = 0;

  @OneWay() itemHeight = 0;

  @OneWay() itemText = '';

  @OneWay() textStyle?: {
    fill: string; fontWeight: number; fontSize: number; fontFamily: string;
  } = {
    fill: '#232323', fontWeight: 400, fontSize: 14, fontFamily: 'Segoe UI',
  };
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class Item extends JSXComponent<ItemProps> {

}
