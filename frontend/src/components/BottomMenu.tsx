import { type ReactNode } from "react";

import IconComponent from "./Icon";

interface BottomMenuProps {
  /** Bottom menu buttons */
  children: ReactNode;
  isOpen: boolean;
  onMenuClose: () => void;
  title: string;
}

function BottomMenu({ children, isOpen, onMenuClose, title }: BottomMenuProps) {
  return (
    <>
      {isOpen && (
        <div className="bottom-menu p-4 d-flex mx-0">
          <span className="fs-3 me-5 my-auto">{title}</span>
          <div className="justify-content-center">{children}</div>
          <MenuCloseButton close={onMenuClose} />
        </div>
      )}
    </>
  );
}

function MenuCloseButton({ close }: { close: () => void }) {
  return (
    <button
      className="bottom-menu-item bg-secondary text-white rounded border border-none border-0 fs-3 p-3 me-auto"
      onClick={close}
      type="button"
    >
      <span className="ps-3">סגירת התפריט</span>
      <IconComponent icon="validateFailure" />
    </button>
  );
}

export default BottomMenu;
