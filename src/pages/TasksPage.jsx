import { useState } from "react";
import { useTasks } from "../context/TasksContext";
import useToggle from "../hooks/useToggle";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useDebounce from "../hooks/useDebounce";

function TasksPage() {
  useDocumentTitle("Tasks");

  // Shared tasks from TasksContext
  const { tasks, setTasks } = useTasks();

  // Form states
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");

  // Modal and editing states
  const [isFormOpen, toggleForm, setIsFormOpen] = useToggle(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Search, filter, and sort states
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate");

  // Task statistics
  const totalTasks = tasks.length;

  const completedCount = tasks.filter((task) => task.completed).length;

  const pendingCount = totalTasks - completedCount;

  const highPriorityCount = tasks.filter(
    (task) => !task.completed && task.priority === "High",
  ).length;

  // Reset form fields
  const resetForm = () => {
    setTitle("");
    setSubject("");
    setDueDate("");
    setPriority("Medium");
    setError("");
    setEditingTaskId(null);
  };

  // Open form for adding a task
  const openAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Close form
  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  // Add or edit a task
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !subject.trim() || !dueDate) {
      setError("Please fill in all fields.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(`${dueDate}T00:00:00`);

    if (selectedDate < today) {
      setError("Due date cannot be in the past.");
      return;
    }

    if (editingTaskId !== null) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title: title.trim(),
                subject: subject.trim(),
                dueDate,
                priority,
              }
            : task,
        ),
      );
    } else {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        subject: subject.trim(),
        dueDate,
        priority,
        completed: false,
      };

      setTasks((currentTasks) => [...currentTasks, newTask]);
    }

    closeForm();
  };

  // Edit an existing task
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setSubject(task.subject);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setError("");
    setIsFormOpen(true);
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  };

  // Mark task as completed or pending
  const handleToggleComplete = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // Search, filter, and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        task.subject.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Pending" && !task.completed) ||
        (filter === "Completed" && task.completed) ||
        (["High", "Medium", "Low"].includes(filter) &&
          task.priority === filter);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return a.dueDate.localeCompare(b.dueDate);
      }

      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "priority") {
        const priorityOrder = {
          High: 1,
          Medium: 2,
          Low: 3,
        };

        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      return 0;
    });

  // Reset search and filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilter("All");
    setSortBy("dueDate");
  };

  const today = new Date().toLocaleDateString("en-CA");

  const priorityStyles = {
    High: "bg-[#F5E1DC] text-[#A4563E]",
    Medium: "bg-[#F3EBDD] text-[#96713E]",
    Low: "bg-[#E9E5DD] text-[#71675C]",
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-[#A18F86]">YOUR WORKSPACE</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#302B32]">
            My Tasks
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#897D76]">
            Plan your activities, organize your priorities, and keep moving
            towards your learning goals.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#C8795D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#AD634B]"
        >
          <span className="text-lg">+</span>
          Add new task
        </button>
      </section>

      {/* Task summary cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
          <p className="mt-2 text-xs text-[#A18F86]">
            All your study activities
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8DED6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#897D76]">Completed</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9E8DF] text-lg text-[#777B5D]">
              ✓
            </span>
          </div>
          <p className="mt-5 text-3xl font-bold text-[#302B32]">
            {completedCount.toString().padStart(2, "0")}
          </p>
          <p className="mt-2 text-xs text-[#A18F86]">Successfully finished</p>
        </div>

        <div className="rounded-2xl border border-[#E8DED6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#897D76]">Pending</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E1DC] text-lg text-[#A4563E]">
              ◷
            </span>
          </div>
          <p className="mt-5 text-3xl font-bold text-[#302B32]">
            {pendingCount.toString().padStart(2, "0")}
          </p>
          <p className="mt-2 text-xs text-[#A18F86]">
            Waiting for your attention
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8DED6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#897D76]">High priority</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1E2E0] text-lg text-[#A4563E]">
              !
            </span>
          </div>
          <p className="mt-5 text-3xl font-bold text-[#302B32]">
            {highPriorityCount.toString().padStart(2, "0")}
          </p>
          <p className="mt-2 text-xs text-[#A18F86]">Pending important tasks</p>
        </div>
      </section>

      {/* Task form modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#302B32]/60 px-4 py-6 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-form-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-7 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#C8795D]">
                  HUBNEST WORKSPACE
                </p>

                <h2
                  id="task-form-title"
                  className="mt-2 text-xl font-bold text-[#302B32]"
                >
                  {editingTaskId !== null ? "Edit task" : "Create a new task"}
                </h2>

                <p className="mt-1 text-sm text-[#897D76]">
                  {editingTaskId !== null
                    ? "Update your study activity."
                    : "Add a new activity to your study plan."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
                className="rounded-lg px-3 py-2 text-xl text-[#897D76] transition hover:bg-[#F7F3EE]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-[#51434A]"
                >
                  Task title
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Complete React assignment"
                  className="w-full rounded-xl border border-[#E8DED6] px-4 py-3 text-sm text-[#302B32] outline-none transition focus:border-[#C8795D] focus:ring-2 focus:ring-[#F5E1DC]"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-[#51434A]"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(event) => {
                      setSubject(event.target.value);
                      setError("");
                    }}
                    placeholder="e.g. JavaScript"
                    className="w-full rounded-xl border border-[#E8DED6] px-4 py-3 text-sm text-[#302B32] outline-none transition focus:border-[#C8795D] focus:ring-2 focus:ring-[#F5E1DC]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dueDate"
                    className="mb-2 block text-sm font-semibold text-[#51434A]"
                  >
                    Due date
                  </label>

                  <input
                    id="dueDate"
                    type="date"
                    min={today}
                    value={dueDate}
                    onChange={(event) => {
                      setDueDate(event.target.value);
                      setError("");
                    }}
                    className="w-full rounded-xl border border-[#E8DED6] px-4 py-3 text-sm text-[#302B32] outline-none transition focus:border-[#C8795D] focus:ring-2 focus:ring-[#F5E1DC]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="mb-2 block text-sm font-semibold text-[#51434A]"
                >
                  Priority level
                </label>

                <select
                  id="priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  className="w-full rounded-xl border border-[#E8DED6] bg-white px-4 py-3 text-sm text-[#302B32] outline-none transition focus:border-[#C8795D] focus:ring-2 focus:ring-[#F5E1DC]"
                >
                  <option value="Low">Low priority</option>
                  <option value="Medium">Medium priority</option>
                  <option value="High">High priority</option>
                </select>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-[#FBEDEC] px-4 py-3 text-sm font-medium text-[#A4563E]"
                >
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-[#EEE7E1] pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-[#E8DED6] px-5 py-3 text-sm font-semibold text-[#71675C] transition hover:bg-[#F7F3EE]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#C8795D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#AD634B]"
                >
                  {editingTaskId !== null ? "Save changes" : "Create task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search, filter and sort */}
      <section className="rounded-2xl border border-[#E8DED6] bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-semibold text-[#51434A]"
            >
              Search your tasks
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-[#E8DED6] px-4 py-3 transition focus-within:border-[#C8795D] focus-within:ring-2 focus-within:ring-[#F5E1DC]">
              <span className="text-[#A18F86]">⌕</span>

              <input
                id="search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title or subject..."
                className="w-full bg-transparent text-sm text-[#302B32] outline-none placeholder:text-[#B1A59D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:w-[390px]">
            <div>
              <label
                htmlFor="filter"
                className="mb-2 block text-sm font-semibold text-[#51434A]"
              >
                Filter
              </label>

              <select
                id="filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="w-full rounded-xl border border-[#E8DED6] bg-white px-3 py-3 text-sm text-[#51434A] outline-none focus:border-[#C8795D]"
              >
                <option value="All">All tasks</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="High">High priority</option>
                <option value="Medium">Medium priority</option>
                <option value="Low">Low priority</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sort"
                className="mb-2 block text-sm font-semibold text-[#51434A]"
              >
                Sort by
              </label>

              <select
                id="sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full rounded-xl border border-[#E8DED6] bg-white px-3 py-3 text-sm text-[#51434A] outline-none focus:border-[#C8795D]"
              >
                <option value="dueDate">Due date</option>
                <option value="priority">Priority</option>
                <option value="title">Title (A–Z)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEE7E1] pt-4">
          <p className="text-xs text-[#A18F86]">
            Showing {filteredTasks.length} of {totalTasks} tasks
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-[#B66D52] transition hover:underline"
          >
            Clear filters
          </button>
        </div>
      </section>

      {/* Task list */}
      <section className="rounded-2xl border border-[#E8DED6] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#302B32]">Your task list</h2>

            <p className="mt-1 text-sm text-[#A18F86]">
              Keep track of everything you need to accomplish.
            </p>
          </div>

          <span className="rounded-lg bg-[#F7F3EE] px-3 py-2 text-xs font-semibold text-[#71675C]">
            {pendingCount} pending · {completedCount} completed
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-[#EEE7E1] p-4 transition hover:border-[#DCCFC7] hover:bg-[#FCFAF8] sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                    aria-label={`Mark ${task.title} as ${
                      task.completed ? "pending" : "completed"
                    }`}
                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#C8795D]"
                  />

                  <div className="min-w-0">
                    <h3
                      className={`break-words text-sm font-semibold ${
                        task.completed
                          ? "text-[#A18F86] line-through"
                          : "text-[#302B32]"
                      }`}
                    >
                      {task.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#A18F86]">
                      {task.subject} · Due {task.dueDate}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          priorityStyles[task.priority] ||
                          "bg-[#E9E5DD] text-[#71675C]"
                        }`}
                      >
                        {task.priority} priority
                      </span>

                      <span
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          task.completed
                            ? "bg-[#E9E8DF] text-[#777B5D]"
                            : "bg-[#F3EBDD] text-[#96713E]"
                        }`}
                      >
                        {task.completed ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleEditTask(task)}
                    className="rounded-lg border border-[#E8DED6] px-4 py-2 text-xs font-semibold text-[#71675C] transition hover:bg-[#F3EBDD]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="rounded-lg border border-[#EBD9D5] px-4 py-2 text-xs font-semibold text-[#A4563E] transition hover:bg-[#F5E1DC]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-xl bg-[#F7F3EE] px-5 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EBDD] text-2xl text-[#C8795D]">
                ✦
              </div>

              <h3 className="mt-4 text-sm font-bold text-[#302B32]">
                {totalTasks === 0
                  ? "Your task list is empty"
                  : "No matching tasks"}
              </h3>

              <p className="mt-2 max-w-sm text-xs leading-5 text-[#897D76]">
                {totalTasks === 0
                  ? "Start organizing your learning by creating your first task."
                  : "Try changing your search or filter to find the task you're looking for."}
              </p>

              {totalTasks === 0 ? (
                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-5 rounded-xl bg-[#C8795D] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#AD634B]"
                >
                  Create your first task
                </button>
              ) : (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 text-xs font-semibold text-[#B66D52] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default TasksPage;
