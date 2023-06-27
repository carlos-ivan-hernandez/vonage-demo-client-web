import NexmoClient from "nexmo-client";
import { useEffect, useRef, useState } from "react";
import "./App.css";

const userJwt = process.env.REACT_APP_USER_JWT ?? "";

export const App = () => {
  const [nexmoApp, setNexmoApp] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("");
  const [callInProgress, setCallInProgress] = useState(false);
  const callButtonRef = useRef<HTMLButtonElement>(null);
  const hangupButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const nexmoApp_ = await new NexmoClient({ debug: false }).createSession(
          userJwt
        );
        setNexmoApp(nexmoApp_);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleClickCall = (event: any) => {
    event.preventDefault();
    if (phoneNumber !== "") {
      nexmoApp.callServer(phoneNumber);
    } else {
      setStatus("Please enter your phone number.");
    }

    nexmoApp.on("member:call", (member: any, call: any) => {
      hangupButtonRef.current?.addEventListener("click", () => {
        call.hangUp();
      });
    });

    nexmoApp.on("call:status:changed", (call: any) => {
      setStatus(`Call status: ${call.status}`);
      if (call.status === call.CALL_STATUS.STARTED) {
        setCallInProgress(true);
      } else {
        setCallInProgress(false);
      }
    });
  };

  return (
    <div className="app">
      <input
        value={phoneNumber}
        onChange={(event) => setPhoneNumber(event.target.value)}
      />
      <button
        id="call"
        ref={callButtonRef}
        onClick={handleClickCall}
        disabled={callInProgress}
      >
        Call
      </button>
      <button id="hangup" ref={hangupButtonRef} disabled={!callInProgress}>
        Hangup
      </button>
      <div id="status">{status}</div>
    </div>
  );
};
