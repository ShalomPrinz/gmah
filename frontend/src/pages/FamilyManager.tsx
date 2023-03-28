import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { ConditionalList } from "../components";

interface Operation {
  id: number;
  description: string;
  url: string;
}

const operations = [
  {
    id: 0,
    description: "הוסף משפחה",
    url: "add",
  },
  {
    id: 1,
    description: "הוסף מתוך טבלת Word",
    url: "add-many",
  },
];

function operationCallback({ description, url }: Operation) {
  return (
    <Link className="fs-1 mx-auto p-4 button-style rounded w-25" to={url}>
      {description}
    </Link>
  );
}

function FamilyManager() {
  return (
    <main className="container text-center mx-auto">
      <Row>
        <h1 className="my-5">ניהול וארגון משפחות</h1>
      </Row>
      <Row>
        <ConditionalList itemCallback={operationCallback} list={operations} />
      </Row>
    </main>
  );
}

export default FamilyManager;
