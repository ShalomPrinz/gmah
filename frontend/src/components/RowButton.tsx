import IconComponent from "./Icon";
import type { Icon } from "../res/icons";

interface RowButtonProps {
  icon: Icon;
  onClick: () => void;
  style: "red" | "blue";
  text: string;
}

function RowButton({ icon, onClick, style, text }: RowButtonProps) {
  const isStyleRed = style === "red";

  const iconColor = isStyleRed ? "red" : "blue";
  const iconFlip = !isStyleRed;

  const buttonStyle = isStyleRed ? "danger" : "primary";
  const className = `me-2 bg-white text-${buttonStyle} rounded fs-5 border border-3 border-${buttonStyle} button-hover`;

  return (
    <td>
      <button className={className} onClick={onClick} type="button">
        <span className="ps-2">{text}</span>
        <IconComponent
          color={iconColor}
          flipHorizontal={iconFlip}
          icon={icon}
        />
      </button>
    </td>
  );
}

export default RowButton;
