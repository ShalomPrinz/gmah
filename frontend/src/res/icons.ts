import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faCircleMinus,
  faImage,
  faTimes,
  faUserPen,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

const icons = {
  addFamily: faUserPlus,
  editFamily: faUserPen,
  navbarClosed: faBars,
  navbarExpanded: faTimes,
  removeItem: faCircleMinus,
};

export type Icon = keyof typeof icons;

export const getIcon = (icon: Icon): IconDefinition => icons[icon] || faImage;
