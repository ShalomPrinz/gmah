import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

import { Table } from "../components";
import IconComponent from "../components/Icon";

const columns = [
  {
    id: 0,
    path: "title",
    label: "פעולה",
  },
  {
    id: 1,
    path: "description",
    label: "תיאור",
  },
];

const operations = [
  {
    id: "0",
    description: "הוסף משפחה",
    title: "הוספת משפחה אחת",
    url: "single",
  },
  {
    id: "1",
    description: "הוספת משפחות באמצעות Word או ידנית",
    title: "הוסף מספר משפחות",
    url: "many",
  },
];

function FamilyManager() {
  const LastColumn = ({ item }: any) => (
    <Link
      className="link-decoration p-2 rounded bg-default border border-none border-0"
      to={item.url}
    >
      <span className="ps-2">מעבר לעמוד</span>
      <IconComponent flipHorizontal icon="options" />
    </Link>
  );

  return (
    <main className="container text-center mx-auto">
      <Row>
        <h1 className="my-5">הוספת משפחות</h1>
      </Row>
      <Row className="mx-auto transform-bigger" style={{ width: "60%" }}>
        <Table
          columns={columns}
          data={operations}
          dataIdProp="id"
          LastColumn={LastColumn}
        />
      </Row>
    </main>
  );
}

export default FamilyManager;
