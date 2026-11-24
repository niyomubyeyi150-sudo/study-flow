import { useState, useEffect, useRef } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import useDocumentTitle from "../hooks/useDocumentTitle";

function FocusPage() {
  useDocumentTitle("Focus");

  // Read saved preferences from Settings
  const [savedSettings] = useLocalStorage("studyflow-settings", {
    displayName: "",
    studyDuration: 25,
    compactMode: false,
  });

  // Get preferred study duration
  const studyDuration = Number(savedSettings.studyDuration) || 25;

  // Session durations in seconds
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
    if (status !== "Running") return;

    timerRef.current = setInterval(() => {
      const remainingTime = Math.max(
        0,
        Math.ceil((endTimeRef.current - Date.now()) / 1000),
      );

      setTimeLeft(remainingTime);

      if (remainingTime === 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        endTimeRef.current = null;
        setStatus("Completed");
      }
    }, 1000);

    // Clean up interval
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [status]);

  // Start or resume timer
  const handleStart = () => {
    if (status === "Running" || timeLeft === 0) return;

    endTimeRef.current = Date.now() + timeLeft * 1000;
    setStatus("Running");
  };

  // Pause timer
  const handlePause = () => {
    if (status !== "Running") return;

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
    if (newSession === session) return;

    setSession(newSession);
    setTimeLeft(SESSION_DURATIONS[newSession]);
    endTimeRef.current = null;
    setStatus("Ready");
  };

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  // Calculate progress
  const totalDuration = SESSION_DURATIONS[session];
  const progress = Math.min(
    100,
    Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100),
  );

  const isStudy = session === "Study";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <section>
        <p className="text-sm font-medium tracking-wide text-[#B66D52]">
          YOUR PERSONAL FOCUS SPACE
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#302B32]">
          Focus Room
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#897D76]">
          Give yourself time to concentrate, make progress, and take meaningful
          breaks along the way.
        </p>
      </section>

      {/* Main timer section */}
      <section className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Timer card */}
        <div className="rounded-2xl border border-[#E8DED6] bg-white p-6 shadow-sm sm:p-10">
          {/* Session selector */}
          <div className="flex justify-center">
            <div className="flex rounded-xl bg-[#F7F3EE] p-1.5">
              {["Study", "Break"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSwitchSession(item)}
                  aria-pressed={session === item}
                  className={`rounded-lg px-7 py-3 text-sm font-semibold transition ${
                    session === item
                      ? "bg-[#C8795D] text-white shadow-sm"
                      : "text-[#71675C] hover:bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Timer display */}
          <div className="mt-10 flex flex-col items-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#A18F86]">
              {session} session
            </p>

            <div
              className="mt-8 flex h-64 w-64 items-center justify-center rounded-full sm:h-72 sm:w-72"
              style={{
                background: `conic-gradient(#C8795D ${progress}%, #F1E9E3 ${progress}% 100%)`,
              }}
              role="progressbar"
              aria-label={`${session} session progress`}
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="flex h-56 w-56 flex-col items-center justify-center rounded-full bg-white sm:h-64 sm:w-64">
                <span className="text-5xl font-bold tracking-tight text-[#302B32] sm:text-6xl tabular-nums">
                  {formattedTime}
                </span>

                <span className="mt-3 text-xs font-medium uppercase tracking-widest text-[#A18F86]">
                  {status === "Running"
                    ? "Time remaining"
                    : status === "Completed"
                      ? "Session finished"
                      : status === "Paused"
                        ? "Timer paused"
                        : "Ready to begin"}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="mt-7 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  status === "Running"
                    ? "bg-[#78916D]"
                    : status === "Completed"
                      ? "bg-[#C8795D]"
                      : "bg-[#C5B9AE]"
                }`}
              />

              <p className="text-sm font-medium text-[#71675C]">{status}</p>
            </div>

            {/* Completion message */}
            {status === "Completed" && (
              <div
                role="status"
                className="mt-5 rounded-xl bg-[#F7F3EE] px-5 py-4 text-center"
              >
                <p className="text-sm font-semibold text-[#302B32]">
                  {isStudy
                    ? "Excellent work! Your study session is complete."
                    : "Your break is over. Ready to focus again?"}
                </p>
              </div>
            )}

            {/* Timer controls */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleStart}
                disabled={status === "Running" || timeLeft === 0}
                className="min-w-32 rounded-xl bg-[#C8795D] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#AD634B] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === "Paused" ? "Resume" : "Start"}
              </button>

              <button
                type="button"
                onClick={handlePause}
                disabled={status !== "Running"}
                className="min-w-28 rounded-xl border border-[#E8DED6] px-6 py-3.5 text-sm font-semibold text-[#71675C] transition hover:bg-[#F7F3EE] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Pause
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-[#E8DED6] px-6 py-3.5 text-sm font-semibold text-[#71675C] transition hover:bg-[#F7F3EE]"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Focus information panel */}
        <aside className="space-y-5">
          {/* Current session */}
          <div className="rounded-2xl bg-[#302B32] p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D9B3A3]">
              CURRENT SESSION
            </p>

            <h2 className="mt-4 text-2xl font-bold">{session} time</h2>

            <p className="mt-2 text-sm leading-6 text-[#D3C9C4]">
              {isStudy
                ? "Stay present, work through your tasks, and give your attention to one thing at a time."
                : "Step away from your screen, stretch, and give your mind time to recharge."}
            </p>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-xs text-[#BDB1AA]">Session duration</p>

              <p className="mt-2 text-2xl font-bold">
                {isStudy ? studyDuration : 5} minutes
              </p>
            </div>
          </div>

          {/* Focus tips */}
          <div className="rounded-2xl border border-[#E8DED6] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EBDD] text-lg text-[#96713E]">
                ✦
              </div>

              <h3 className="font-bold text-[#302B32]">Focus tips</h3>
            </div>

            <ul className="mt-5 space-y-4 text-sm leading-5 text-[#897D76]">
              <li className="flex gap-3">
                <span className="font-bold text-[#C8795D]">01</span>
                Choose one task to work on.
              </li>

              <li className="flex gap-3">
                <span className="font-bold text-[#C8795D]">02</span>
                Put away distractions before starting.
              </li>

              <li className="flex gap-3">
                <span className="font-bold text-[#C8795D]">03</span>
                Take breaks to refresh your mind.
              </li>
            </ul>
          </div>
        </aside>
      </section>

      {/* Session duration overview */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#302B32]">
            Your session plan
          </h2>

          <p className="mt-1 text-sm text-[#A18F86]">
            Your preferred study and break durations.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E8DED6] bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#302B32]">Study duration</h3>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E1DC] text-[#B66D52]">
                ◷
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#C8795D]">
              {studyDuration} min
            </p>

            <p className="mt-2 text-sm text-[#897D76]">
              Dedicated time for learning and completing tasks.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8DED6] bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#302B32]">Break duration</h3>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9E8DF] text-[#777B5D]">
                ☕
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#777B5D]">5 min</p>

            <p className="mt-2 text-sm text-[#897D76]">
              A short break to relax and recharge.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FocusPage;
