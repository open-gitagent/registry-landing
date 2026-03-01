import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "../components/Icons";

export default function NotFound() {
  return (
    <section style={{ paddingTop: 100 }}>
      <div
        className="container"
        style={{ textAlign: "center", padding: "120px 0" }}
      >
        <h1
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "4rem",
            color: "var(--text-faint)",
          }}
        >
          404
        </h1>
        <p className="text-muted" style={{ margin: "16px auto" }}>
          Page not found
        </p>
        <Link
          to="/"
          className="back-link"
          style={{ justifyContent: "center", marginTop: 24 }}
        >
          <ArrowLeftIcon /> Back to home
        </Link>
      </div>
    </section>
  );
}
