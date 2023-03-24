import { Form, Formik } from "formik";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { ConditionalList } from "../";
import type { TextInput } from "./FormTextInput";
import { FormTextInput } from "./FormTextInput";
import "./Form.css";

interface FormProps {
  onSubmit: (values: {}) => Promise<any>;
  /** Yup Object Schema */
  schema: any;
  textInputs: Array<TextInput>;
  title: string;
}

const inputCallback = (item: TextInput) => (
  <Col>
    <FormTextInput {...item} />
  </Col>
);

const AppForm = ({ onSubmit, schema, textInputs, title }: FormProps) => {
  const initialValues = textInputs.reduce(
    (o, key) => ({ ...o, [key.name]: "" }),
    {}
  );

  // @ts-ignore This function parameters types is determined by Formik
  const handleSubmit = (values, { resetForm, setSubmitting }) =>
    onSubmit(values)
      .then((submitSucceed) => {
        if (submitSucceed) resetForm();
      })
      .finally(() => setSubmitting(false));

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      <Form className="container">
        <Row>
          <h1>{title}</h1>
        </Row>
        <Row>
          <ConditionalList itemCallback={inputCallback} list={textInputs} />
        </Row>
        <Row>
          <button
            className="fs-1 bg-default w-50 mx-auto p-3 m-4 rounded button-border-focus"
            type="submit"
          >
            {title}
          </button>
        </Row>
      </Form>
    </Formik>
  );
};

export default AppForm;
