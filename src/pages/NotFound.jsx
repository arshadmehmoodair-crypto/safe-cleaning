import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="not-found">

      <h1>404</h1>

      <h2>Page Not Found</h2>

      <p>
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>

      <Link to="/">
        <button className="home-btn">
          Back to Home
        </button>
      </Link>

    </section>
  );
}

export default NotFound;