import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getIcon, Icon } from "../res/icons";

interface IconProps {
  icon: Icon;
}

const IconComponent = ({ icon }: IconProps) => {
  return <FontAwesomeIcon color="white" icon={getIcon(icon)} />;
};

export default IconComponent;
