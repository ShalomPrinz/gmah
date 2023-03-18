import { useState } from "react";
import Form from "react-bootstrap/Form";

import { ConditionalList } from ".";

interface RadioButton {
  id: string;
  text: string;
  value: string;
}

interface RadioMenuProps {
  buttons: RadioButton[];
  menuId: string;
  onSelect: (value: string) => void;
}

function RadioMenu({ buttons, menuId, onSelect }: RadioMenuProps) {
  const initialSelected = buttons?.length ? buttons[0].value : "";
  const [selected, setSelected] = useState(initialSelected);

  const onButtonSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  const buttonCallback = ({ id, text, value }: RadioButton) => (
    <Form.Check
      id={id}
      className="fs-5 my-0"
      checked={selected === value}
      label={text}
      name={menuId}
      onChange={(e) => onButtonSelect(e.target.value)}
      reverse
      type="radio"
      value={value}
    />
  );

  return (
    <Form>
      <ConditionalList itemCallback={buttonCallback} list={buttons} />
    </Form>
  );
}

export default RadioMenu;
