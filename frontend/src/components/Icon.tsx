import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getIcon, Icon } from "../res/icons";

interface IconProps {
  color?: "white" | "red";
  icon: Icon;
}

const IconComponent = ({ color = "white", icon }: IconProps) => {
  return <FontAwesomeIcon color={color} icon={getIcon(icon)} />;
};

export default IconComponent;
