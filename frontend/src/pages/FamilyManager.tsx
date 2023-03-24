import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";

function FamilyManager() {
  const navigate = useNavigate();

  return (
    <main className="container text-center mx-auto">
      <Row>
        <h1 className="my-5">ניהול וארגון משפחות</h1>
      </Row>
      <Row>
        <button
          className="fs-1 mx-auto p-4 button-style rounded w-25"
          onClick={() => navigate("add")}
          type="button"
        >
          הוסף משפחה
        </button>
      </Row>
    </main>
  );
}

export default FamilyManager;
