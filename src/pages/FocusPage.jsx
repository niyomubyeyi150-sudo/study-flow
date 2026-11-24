import { useState, useEffect, useRef } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import useDocumentTitle from "../hooks/useDocumentTitle";
function FocusPage() {
  useDocumentTitle("Focus");
  // Read the saved preferences from Settings
  const [savedSettings] = useLocalStorage("studyflow-settings", {
    displayName: "",
    studyDuration: 25,
    compactMode: false,
  });

  // Get the preferred study duration
  const studyDuration = Number(savedSettings.studyDuration) || 25;

  // Set the session durations
  const SESSION_DURATIONS = {
    Study: studyDuration * 60,
    Break: 5 * 60,
  };

  const [session, setSession] = useState("Study");
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATIONS.Study);
  const [status, setStatus] = useState("Ready");

  const timerRef = useRef(null);
  const endTimeRef = useRef(null);

  // Countdown effect
  useEffect(() => {
    if (status !== "Running") {
      return;
    }

    timerRef.current = setInterval(() => {
      const remainingTime = Math.max(
        0,
        Math.ceil((endTimeRef.current - Date.now()) / 1000),
      );

      setTimeLeft(remainingTime);

      if (remainingTime === 0) {
        clearInterval(timerRef.current);
        setStatus("Completed");
        endTimeRef.current = null;
      }
    }, 250);

    // Cleanup
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [status]);

  // Start or resume timer
  const handleStart = () => {
    if (status === "Running" || timeLeft === 0) {
      return;
    }

    endTimeRef.current = Date.now() + timeLeft * 1000;
    setStatus("Running");
  };

  // Pause timer
  const handlePause = () => {
    if (status !== "Running") {
      return;
    }

    const remainingTime = Math.max(
      0,
      Math.ceil((endTimeRef.current - Date.now()) / 1000),
    );

    setTimeLeft(remainingTime);
    endTimeRef.current = null;

    setStatus(remainingTime === 0 ? "Completed" : "Paused");
  };

  // Reset current session
  const handleReset = () => {
    setTimeLeft(SESSION_DURATIONS[session]);
    endTimeRef.current = null;
    setStatus("Ready");
  };

  // Switch session and reset timer
  const handleSwitchSession = (newSession) => {
    if (newSession === session) {
      return;
    }

    setSession(newSession);
    setTimeLeft(SESSION_DURATIONS[newSession]);
    endTimeRef.current = null;
    setStatus("Ready");
  };

  // Format time into MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  // Calculate progress
  const totalDuration = SESSION_DURATIONS[session];
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Page heading */}
        <div>
          <p className="text-sm font-medium tracking-wider text-[#806A91]">
            STAY FOCUSED
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#3B3044]">
            Focus Timer
          </h1>

          <p className="mt-2 text-[#938B94]">
            Make time for focused learning and meaningful breaks.
          </p>
        </div>

        {/* Timer card */}
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">
          {/* Session selection */}
          <div className="flex justify-center gap-3">
            {["Study", "Break"].map((item) => (
              <button
                key={item}
                onClick={() => handleSwitchSession(item)}
                aria-pressed={session === item}
                className={`rounded-xl px-6 py-3 font-medium transition ${
                  session === item
                    ? "bg-[#3B3044] text-white"
                    : "bg-[#EAE2F1] text-[#3B3044] hover:bg-[#D9C9EF]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Session information */}
          <p className="mt-10 text-sm font-medium text-[#806A91]">
            {session} Session
          </p>

          {/* Countdown */}
          <h2 className="mt-4 text-6xl font-bold tracking-tight text-[#3B3044] sm:text-7xl">
            {formattedTime}
          </h2>

          {/* Progress bar */}
          <div
            className="mx-auto mt-8 h-2 max-w-md overflow-hidden rounded-full bg-[#EAE2F1]"
            role="progressbar"
            aria-label="Session progress"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-[#806A91] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Session status */}
          <p className="mt-6 text-sm font-medium text-[#806A91]">
            Status: {status}
          </p>

          {/* Completion message */}
          {status === "Completed" && (
            <p className="mt-3 font-medium text-[#3B3044]">
              {session === "Study"
                ? "Great work! Your study session is complete."
                : "Your break is over. Ready to study again?"}
            </p>
          )}

          {/* Timer controls */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleStart}
              disabled={status === "Running" || timeLeft === 0}
              className="rounded-xl bg-[#3B3044] px-8 py-3 font-medium text-white transition hover:bg-[#51415D] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "Paused" ? "Resume" : "Start"}
            </button>

            <button
              onClick={handlePause}
              disabled={status !== "Running"}
              className="rounded-xl bg-[#EAE2F1] px-8 py-3 font-medium text-[#3B3044] transition hover:bg-[#D9C9EF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Pause
            </button>

            <button
              onClick={handleReset}
              className="rounded-xl border border-[#D9C9EF] px-8 py-3 font-medium text-[#3B3044] transition hover:bg-[#F7F4EF]"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Session duration information */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#EAE2F1] p-6">
            <h3 className="font-semibold text-[#3B3044]">Study Duration</h3>

            <p className="mt-2 text-2xl font-bold text-[#806A91]">
              {studyDuration} minutes
            </p>

            <p className="mt-1 text-sm text-[#6F6576]">
              Dedicated time for learning and completing tasks.
            </p>
          </div>

          <div className="rounded-2xl bg-[#F1E1E3] p-6">
            <h3 className="font-semibold text-[#3B3044]">Break Duration</h3>

            <p className="mt-2 text-2xl font-bold text-[#806A91]">5 minutes</p>

            <p className="mt-1 text-sm text-[#6F6576]">
              Take a short break and refresh your mind.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusPage;
