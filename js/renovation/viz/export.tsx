import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment, Effect, Ref,
} from 'devextreme-generator/component_declaration/common';
import { buildLinePathFromPoints } from './renderer';
import { click } from '../../events/short';
import List from './list';

const ICON_TITLE = 'Exporting/Printing';
const STROKE_WIDTH = 1;
const CURSOR = 'pointer';
const BUTON_RADIUS = 4;
const BUTTON_SIZE = 35;

export const viewFunction = ({
  iconPath,
  visibleList,
  rootRef,
  props: {
    x, y, color, strokeColor, iconColor,
  },
}: Export) => (
  <Fragment>
    <g ref={rootRef}>
      <rect
        x={x}
        y={y}
        width={BUTTON_SIZE}
        height={BUTTON_SIZE}
        fill={color}
        stroke={strokeColor}
        strokeWidth={STROKE_WIDTH}
        cursor={CURSOR}
        rx={BUTON_RADIUS}
        ry={BUTON_RADIUS}
      />
      <path
        d={iconPath}
        fill={iconColor}
        cursor={CURSOR}
      />
      <title>
        { ICON_TITLE }
      </title>
    </g>
    {visibleList && (
    <g>
      <List offset={BUTTON_SIZE + y} x={x} />
    </g>
    )}

  </Fragment>
);

@ComponentBindings()
export class ExportProps {
  @OneWay() x?: number = 0;

  @OneWay() y?: number = 0;

  @OneWay() color = '';

  @OneWay() strokeColor = '';

  @OneWay() iconColor?: string = '#000000';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class Export extends JSXComponent<ExportProps> {
  @Ref() rootRef!: SVGGElement;

  visibleList?: boolean = false;

  iconCoords: number[][] = [
    [9, 12, 26, 12, 26, 14, 9, 14],
    [9, 17, 26, 17, 26, 19, 9, 19],
    [9, 22, 26, 22, 26, 24, 9, 24],
  ];

  get iconPath() {
    return buildLinePathFromPoints(this.iconCoords);
  }

  @Effect()
  clickEffect() {
    click.on(this.rootRef, () => {
      this.visibleList = !this.visibleList;
    });

    return () => click.off(this.rootRef);
  }
}
