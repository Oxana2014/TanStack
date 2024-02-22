import {
  Link,
  redirect,
  useNavigate,
  useParams,
  useSubmit,
  useNavigation,
} from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { fetchEvent, updateEvent, queryClient } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
  const navigate = useNavigate();
  const params = useParams();
  const submit = useSubmit();
  const { state } = useNavigation();

  //continue using to have cashed queries
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
    staleTime: 10000
  });

  // const { mutate } = useMutation({
  //   mutationFn: updateEvent,
  //   onMutate: async (data) => {
  //     //this data is arguments for mutate()
  //     await queryClient.cancelQueries({ queryKey: ["events", params.id] });
  //     const previousEvent = queryClient.getQueryData(["events", params.id]);
  //     queryClient.setQueryData(["events", params.id], data.event); // optimistic updating

  //     return { previousEvent }; //this will be context of onError()
  //   },
  //   onError: (error, data, context) => {
  //     queryClient.setQueryData(["events", params.id], context.previousEvent); // roll back if the mutation fails
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries(["events", params.id]) //clean cash to refetch data to be sure we synchronize with backend
  //   }
  // });

  function handleSubmit(formData) {
    // mutate({ id: params.id, event: formData });
    // navigate("../");
    submit(formData, { method: "PUT" }); //we a re not sending http request, just triggering action, and method should be not 'get'
  }

  function handleClose() {
    navigate("../");
  }
  let content;

  // with loader fn we should not meet pending state
  // if (isPending) {
  //   content = (
  //     <div className="center">
  //       <LoadingIndicator />
  //     </div>
  //   );
  // }
  if (isError) {
    content = (
      <div className="center">
        <ErrorBlock
          title="Failed to fetch event"
          message={
            error.info?.message ||
            "Failed load event.heck your inputs and try again later"
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </div>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === "submitting" ? (
          <p>Sending data...</p>
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}

//to load component already having data
export function loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData); // gives us normal JS object
  await updateEvent({ id: params.id, event: updatedEventData });
  await queryClient.invalidateQueries(["events"]); //we have NO MORE optimistic update!!!
  return redirect("../");
}
