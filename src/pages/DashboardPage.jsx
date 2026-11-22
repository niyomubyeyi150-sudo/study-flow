import useLocalStorage from "../hooks/useLocalStorage";

function DashboardPage() {
  // Get the same tasks saved by the Tasks page
  const [tasks] = useLocalStorage("studyflow-tasks", []);

  // Calculate task statistics
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed).length;

  const pendingTasks = totalTasks - completedTasks;

  // Calculate completion percentage
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Get the three nearest pending tasks
  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#F7F4EF]">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Welcome section */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p></p>
            <h1 className="text-3xl font-bold tracking-tight text-[#302B32]">
              Welcome back!
            </h1>

            <p className="mt-2 text-sm text-[#766F78]">
              Organize your learning and make every study session count.
            </p>
          </div>

          <a
            href="/tasks"
            className="inline-flex w-fit items-center justify-center rounded-xl bg-[#3B3044] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#51425B]"
          >
            View my tasks
            <span className="ml-2">→</span>
          </a>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {/* Total tasks */}
          <div className="rounded-2xl border border-[#E5D9EC] bg-[#EAE2F1] p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#685675]">
                Total tasks
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-lg text-[#806A91]">
                ▤
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#493A55]">
              {totalTasks.toString().padStart(2, "0")}
            </p>

            <p className="mt-2 text-xs text-[#766B7E]">
              Tasks in your study list
            </p>
          </div>

          {/* Completed tasks */}
          <div className="rounded-2xl border border-[#E2E4DC] bg-[#E9ECE5] p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#58634F]">Completed</p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-lg text-[#687B61]">
                ✓
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#465641]">
              {completedTasks.toString().padStart(2, "0")}
            </p>

            <p className="mt-2 text-xs text-[#74806E]">
              Tasks successfully finished
            </p>
          </div>

          {/* Pending tasks */}
          <div className="rounded-2xl border border-[#EBD9DE] bg-[#F1E1E3] p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#875E6C]">Pending</p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-lg text-[#A36F80]">
                ◷
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#79505F]">
              {pendingTasks.toString().padStart(2, "0")}
            </p>

            <p className="mt-2 text-xs text-[#916E79]">Tasks waiting for you</p>
          </div>
        </section>

        {/* Dashboard content */}
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Upcoming tasks */}
          <div className="rounded-2xl border border-[#EAE4DE] bg-white p-6 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#302B32]">
                  Upcoming tasks
                </h2>

                <p className="mt-1 text-sm text-[#938B94]">
                  Stay on top of your study schedule
                </p>
              </div>

              <a
                href="/tasks"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#806A91] transition hover:bg-[#F2EDF5]"
              >
                View all →
              </a>
            </div>

            {/* Display upcoming tasks */}
            <div className="mt-6 space-y-3">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-[#EEE9E5] p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-[#302B32]">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-xs text-[#938B94]">
                        {task.subject} · Due {task.dueDate}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-lg px-3 py-1 text-xs font-semibold ${
                        task.priority === "High"
                          ? "bg-[#F1E1E3] text-[#79505F]"
                          : task.priority === "Medium"
                            ? "bg-[#EAE2F1] text-[#685675]"
                            : "bg-[#E9ECE5] text-[#58634F]"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl bg-[#F8F5FA] px-5 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAE2F1] text-xl text-[#806A91]">
                    ✦
                  </div>

                  <p className="text-sm font-semibold text-[#493A55]">
                    No upcoming tasks
                  </p>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-[#938B94]">
                    Your upcoming study tasks will appear here. Add a task and
                    start organizing your learning.
                  </p>

                  <a
                    href="/tasks"
                    className="mt-4 text-xs font-bold text-[#806A91] hover:underline"
                  >
                    Add your first task
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Study progress */}
          <div className="rounded-2xl border border-[#EAE4DE] bg-white p-6">
            <h2 className="text-lg font-bold text-[#302B32]">Study progress</h2>

            <p className="mt-1 text-sm text-[#938B94]">
              Your completion overview
            </p>

            <div className="mt-7 flex flex-col items-center">
              <div
                className="flex h-36 w-36 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#806A91 ${progress}%, #EEE8F1 ${progress}% 100%)`,
                }}
              >
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white">
                  <span className="text-3xl font-bold text-[#493A55]">
                    {progress}%
                  </span>
                </div>
              </div>

              <p className="mt-5 text-center text-sm font-bold text-[#493A55]">
                {progress === 100
                  ? "All tasks completed!"
                  : progress > 0
                    ? "Good progress!"
                    : "Ready to get started?"}
              </p>

              <p className="mt-1 text-center text-xs text-[#938B94]">
                Keep building your study habits.
              </p>
            </div>

            <div className="mt-7 space-y-4 border-t border-[#F0EBE6] pt-5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#819176]" />
                  <span className="text-[#766F78]">Completed</span>
                </div>

                <span className="font-semibold text-[#465641]">
                  {completedTasks}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C48C9B]" />
                  <span className="text-[#766F78]">Remaining</span>
                </div>

                <span className="font-semibold text-[#79505F]">
                  {pendingTasks}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;
