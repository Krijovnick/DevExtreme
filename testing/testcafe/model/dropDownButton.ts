import DropDownList from './internal/dropDownList';

const ATTR = {
  popupId: 'aria-owns',
};

export default class DropDownButton extends DropDownList {
  name = 'dxDropDownButton';

  getPopupOwnerElement () {
    return this.element;
  }

  getPopupIdAttr () {
    return ATTR.popupId;
  }
}
