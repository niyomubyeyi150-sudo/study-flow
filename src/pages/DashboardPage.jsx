import { Link } from "react-router-dom";
import { useTasks } from "../context/TasksContext";
import useLocalStorage from "../hooks/useLocalStorage";
import useDocumentTitle from "../hooks/useDocumentTitle";

function DashboardPage() {
  useDocumentTitle("Dashboard");

  const { tasks } = useTasks();

  const [settings] = useLocalStorage("studyflow-settings", {
    displayName: "",
    studyDuration: 25,
    compactMode: false,
  });

  // Task statistics
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed).length;

  const pendingTasks = totalTasks - completedTasks;

  const highPriorityTasks = tasks.filter(
    (task) => !task.completed && task.priority === "High",
  ).length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Upcoming tasks
  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const priorityStyles = {
    High: "bg-[#F5E1DC] text-[#A4563E]",
    Medium: "bg-[#F3EBDD] text-[#96713E]",
    Low: "bg-[#E9E5DD] text-[#71675C]",
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-[#A18F86]">{today}</p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#302B32] sm:text-3xl">
            Welcome back
            {settings.displayName ? `, ${settings.displayName}` : ""}!
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#897D76]">
            Your learning journey continues here. Take a look at your progress
            and plan your next step.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/focus"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCCFC7] bg-white px-4 py-3 text-sm font-semibold text-[#51434A] transition hover:bg-[#F3EBDD]"
          >
            <span>◷</span>
            Focus session
          </Link>

          <Link
            to="/tasks"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8795D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#AD634B]"
          >
            <span>+</span>
            Manage tasks
          </Link>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total tasks */}
        <div className="rounded-2xl border border-[#E8DED6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#897D76]">Total tasks</p>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EBDD] text-lg text-[#96713E]">
              ▤
            </span>
          </div>

          <p className="mt-5 text-3xl font-bold text-[#302B32]">
            {totalTasks.toString().padStart(2, "0")}
          </p>

          <p className="mt-2 text-xs text-[#A18F86]">All your study tasks</p>
        </div>

        {/* Completed tasks */}
        <div className="rounded-2xl border border-[#E8DED6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#897D76]">Completed</p>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9E8DF] text-lg text-[#777B5D]">
              ✓
            </span>
          </div>

          <p className="mt-5 text-3xl font-bold text-[#302B32]">
            {completedTasks.toString().padStart(2, "0")}
          </p>

          <p className="mt-2 text-xs text-[#A18F86]">Tasks you have finished</p>
        </div>

        {/* Pending tasks */}
        <div className="rounded-2xl border border-[#E8DED6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#897D76]">Pending</p>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E1DC] text-lg text-[#A4563E]">
              ◷
            </span>
          </div>

          <p className="mt-5 text-3xl font-bold text-[#302B32]">
            {pendingTasks.toString().padStart(2, "0")}
          </p>

          <p className="mt-2 text-xs text-[#A18F86]">Tasks still to complete</p>
        </div>

        {/* High priority tasks */}
        <div className="rounded-2xl border border-[#E8DED6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#897D76]">High priority</p>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1E2E0] text-lg text-[#A4563E]">
              !
            </span>
          </div>

          <p className="mt-5 text-3xl font-bold text-[#302B32]">
            {highPriorityTasks.toString().padStart(2, "0")}
          </p>

          <p className="mt-2 text-xs text-[#A18F86]">Tasks needing attention</p>
        </div>
      </section>

      {/* Main dashboard panels */}
      <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        {/* Study progress */}
        <div className="rounded-2xl border border-[#E8DED6] bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#302B32]">
                Your study overview
              </h2>

              <p className="mt-1 text-sm text-[#A18F86]">
                Track your progress and celebrate your achievements.
              </p>
            </div>

            <span className="rounded-lg bg-[#F3EBDD] px-3 py-2 text-xs font-semibold text-[#96713E]">
              Overall progress
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            {/* Progress circle */}
            <div className="flex flex-col items-center justify-center">
              <div
                className="flex h-44 w-44 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#C8795D ${progress}%, #F1E9E3 ${progress}% 100%)`,
                }}
              >
                <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-4xl font-bold text-[#302B32]">
                    {progress}%
                  </span>

                  <span className="mt-1 text-xs text-[#A18F86]">Completed</span>
                </div>
              </div>

              <p className="mt-5 text-sm font-semibold text-[#51434A]">
                {progress === 100
                  ? "Amazing! Everything is complete."
                  : progress > 0
                    ? "You're making progress!"
                    : "Your journey starts here!"}
              </p>
            </div>

            {/* Progress details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#51434A]">
                    Completed tasks
                  </p>

                  <p className="text-sm font-bold text-[#51434A]">
                    {completedTasks}
                  </p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F1E9E3]">
                  <div
                    className="h-full rounded-full bg-[#8B8D6A] transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#51434A]">
                    Pending tasks
                  </p>

                  <p className="text-sm font-bold text-[#51434A]">
                    {pendingTasks}
                  </p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F1E9E3]">
                  <div
                    className="h-full rounded-full bg-[#C8795D] transition-all"
                    style={{
                      width: `${
                        totalTasks === 0 ? 0 : (pendingTasks / totalTasks) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-[#F7F3EE] p-4">
                <p className="text-sm font-semibold text-[#51434A]">
                  Keep going!
                </p>

                <p className="mt-1 text-xs leading-5 text-[#897D76]">
                  Every completed task brings you one step closer to your
                  learning goals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Focus session card */}
        <div className="rounded-2xl bg-[#302B32] p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-[#E8D5CC]">
              Focus room
            </span>

            <span className="text-xl text-[#D99A7D]">◷</span>
          </div>

          <h2 className="mt-7 text-xl font-bold">Ready to focus?</h2>

          <p className="mt-2 text-sm leading-6 text-[#C9BDB8]">
            Take some dedicated time to study without distractions.
          </p>

          <div className="mt-7 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-[#C9BDB8]">Your study session</p>

            <p className="mt-2 text-3xl font-bold">
              {settings.studyDuration || 25}
              <span className="ml-2 text-sm font-medium text-[#C9BDB8]">
                minutes
              </span>
            </p>
          </div>

          <Link
            to="/focus"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C8795D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#AD634B]"
          >
            Start focusing
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Upcoming tasks */}
      <section className="rounded-2xl border border-[#E8DED6] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#302B32]">Upcoming tasks</h2>

            <p className="mt-1 text-sm text-[#A18F86]">
              Your next tasks to work on.
            </p>
          </div>

          <Link
            to="/tasks"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#B66D52] transition hover:bg-[#F7F3EE]"
          >
            View all tasks →
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-[#EEE7E1] p-4 transition hover:border-[#DCCFC7] hover:bg-[#FCFAF8] sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3EBDD] text-sm text-[#96713E]">
                    ▤
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold text-[#302B32]">
                      {task.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#A18F86]">
                      {task.subject} · Due {task.dueDate}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-lg px-3 py-2 text-xs font-semibold ${
                    priorityStyles[task.priority] ||
                    "bg-[#E9E5DD] text-[#71675C]"
                  }`}
                >
                  {task.priority} priority
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#F7F3EE] px-5 py-10 text-center">
              <span className="text-3xl text-[#C8795D]">✦</span>

              <h3 className="mt-3 text-sm font-bold text-[#302B32]">
                You're all caught up!
              </h3>

              <p className="mt-2 max-w-sm text-xs leading-5 text-[#897D76]">
                There are no pending tasks right now. Add a new task whenever
                you're ready for your next challenge.
              </p>

              <Link
                to="/tasks"
                className="mt-4 rounded-lg bg-[#C8795D] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#AD634B]"
              >
                Add a task
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
