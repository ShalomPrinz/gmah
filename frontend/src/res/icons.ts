import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faRightFromBracket,
  faPeopleCarryBox,
  faCheck,
  faCircleMinus,
  faExclamationTriangle,
  faFileCircleCheck,
  faFilePen,
  faFloppyDisk,
  faHandPointer,
  faImage,
  faPersonWalkingArrowLoopLeft,
  faShare,
  faTimes,
  faUserPen,
  faUserPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const icons = {
  addFamily: faUserPlus,
  createPdf: faFileCircleCheck,
  editFamily: faUserPen,
  forwardItem: faShare,
  markReceive: faPeopleCarryBox,
  navbarClosed: faBars,
  navbarExpanded: faTimes,
  options: faRightFromBracket,
  removeItem: faCircleMinus,
  restoreItem: faPersonWalkingArrowLoopLeft,
  saveChanges: faFloppyDisk,
  selectReport: faHandPointer,
  updateManagers: faFilePen,
  validateFailure: faXmark,
  validateSuccess: faCheck,
  validateWarning: faExclamationTriangle,
};

export type Icon = keyof typeof icons;

export const getIcon = (icon: Icon): IconDefinition => icons[icon] || faImage;
