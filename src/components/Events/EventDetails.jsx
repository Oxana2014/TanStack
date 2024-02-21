import { Link, Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Header from "../Header.jsx";
import { fetchEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
  const { id } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", { search: id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {isPending && <p>Loading event details...</p>}
      {isError && (
        <ErrorBlock
          title="Could not fetch event details"
          message={error.info?.message || "Could not fetch event details"}
        />
      )}
      {data && (
        
        <article id="event-details">
          <header>
            <h1>{data.title}</h1>
            <nav>
              <button>Delete</button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} alt={data.image} />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} @ {data.time}</time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>
      )}
    </>
  );
}
