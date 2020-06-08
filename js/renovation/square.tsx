import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Effect, Ref,
} from 'devextreme-generator/component_declaration/common';
import { click } from '../events/short';

export const viewFunction = ({ rootRef, color, props: { x, y, size } }: Square) => (
  <g ref={rootRef}>
    <rect x={x} y={y} width={size} height={size} fill={color} strokeWidth="0" />
  </g>
);

@ComponentBindings()
export class SquareProps {
  @OneWay() x?: number = 0;

  @OneWay() y?: number = 0;

  @OneWay() size?: number = 100;

  @TwoWay() color?: string = 'red';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class Square extends JSXComponent<SquareProps> {
  @Ref() rootRef!: SVGGElement;

  @Effect()
  clickEffect() {
    click.on(this.rootRef, () => {
      this.props.color = this.props.color !== 'red' ? 'red' : 'yellow';
    });

    return () => click.off(this.rootRef);
  }

  get color(): string {
    return this.props.color !== 'green' ? this.props.color! : 'red';
  }
}
