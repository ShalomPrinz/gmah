import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faCircleMinus,
  faFilePen,
  faImage,
  faShare,
  faTimes,
  faUserPen,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

const icons = {
  addFamily: faUserPlus,
  editFamily: faUserPen,
  forwardItem: faShare,
  navbarClosed: faBars,
  navbarExpanded: faTimes,
  removeItem: faCircleMinus,
  updateManagers: faFilePen,
};

export type Icon = keyof typeof icons;

export const getIcon = (icon: Icon): IconDefinition => icons[icon] || faImage;
