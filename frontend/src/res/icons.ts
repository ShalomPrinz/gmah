import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBars, faImage, faTimes } from "@fortawesome/free-solid-svg-icons";

const icons = {
  navbarClosed: faBars,
  navbarExpanded: faTimes,
};

export type Icon = keyof typeof icons;

export const getIcon = (icon: Icon): IconDefinition => icons[icon] || faImage;
