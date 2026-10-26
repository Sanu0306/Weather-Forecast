import { useEffect, useState } from "react";
import { checkBackend } from "./backend";

function BackendTest() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    checkBackend()
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Backend connection failed"));
  }, []);

  return <p>{message}</p>;
}

export default BackendTest;
