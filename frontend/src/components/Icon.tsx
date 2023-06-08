import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getIcon, Icon } from "../res/icons";

interface IconProps {
  color?: "blue" | "red" | "white";
  flipHorizontal?: boolean;
  icon: Icon;
}

const IconComponent = ({
  color = "white",
  flipHorizontal,
  icon,
}: IconProps) => {
  return (
    <FontAwesomeIcon
      flip={flipHorizontal ? "horizontal" : undefined}
      color={color}
      icon={getIcon(icon)}
    />
  );
};

export default IconComponent;
