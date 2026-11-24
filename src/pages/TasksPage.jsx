import { useState } from "react";
import initialTasks from "../data/initialTasks";
import useLocalStorage from "../hooks/useLocalStorage";
import useToggle from "../hooks/useToggle";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useDebounce from "../hooks/useDebounce";
function TasksPage() {
  useDocumentTitle("tasks");
const [tasks, setTasks] = useLocalStorage("studyflow-tasks", initialTasks);

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
  toggleForm();
  };

  // Close form
  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  // Add or edit a task
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate required fields
    if (!title.trim() || !subject.trim() || !dueDate) {
      setError("Please fill in all fields.");
      return;
    }

    // Validate due date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(`${dueDate}T00:00:00`);

    if (selectedDate < today) {
      setError("Due date cannot be in the past.");
      return;
    }

    if (editingTaskId !== null) {
      // Update existing task
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
      // Create a new task
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        subject: subject.trim(),
        dueDate,
        priority,
        completed: false,
      };

      // Add task immutably
      setTasks((currentTasks) => [...currentTasks, newTask]);
    }

    closeForm();
  };

  // Open form with existing task information
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

  // Filter and sort tasks
 const filteredTasks = tasks
   .filter((task) => {
     return (
       task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
       task.subject.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
     );
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

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#806A91]">
            Stay organized
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#302B32]">
            My Tasks
          </h1>

          <p className="mt-2 text-sm text-[#766F78]">
            Manage your study activities and keep track of your progress.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="rounded-xl bg-[#EAE2F1] px-5 py-3">
            <p className="text-xs font-medium text-[#685675]">Total tasks</p>
            <p className="mt-1 text-2xl font-bold text-[#493A55]">
              {tasks.length.toString().padStart(2, "0")}
            </p>
          </div>

          <div className="rounded-xl bg-[#E9ECE5] px-5 py-3">
            <p className="text-xs font-medium text-[#58634F]">Completed</p>
            <p className="mt-1 text-2xl font-bold text-[#465641]">
              {completedCount.toString().padStart(2, "0")}
            </p>
          </div>
        </div>
      </section>

      {/* Add task button */}
      <section className="flex justify-end">
        <button
          type="button"
          onClick={openAddForm}
          className="rounded-xl bg-[#3B3044] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#51425B]"
        >
          + Add task
        </button>
      </section>

      {/* Add and edit task modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-form-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="task-form-title"
                  className="text-xl font-bold text-[#302B32]"
                >
                  {editingTaskId !== null ? "Edit task" : "Add a new task"}
                </h2>

                <p className="mt-1 text-sm text-[#938B94]">
                  {editingTaskId !== null
                    ? "Update your study activity."
                    : "Plan your next learning activity."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg px-3 py-2 text-xl text-[#766F78] hover:bg-[#F4F0F5]"
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Task title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-[#493A55]"
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
                  className="w-full rounded-xl border border-[#E5DDE9] px-4 py-3 text-sm outline-none focus:border-[#806A91] focus:ring-2 focus:ring-[#EAE2F1]"
                />
              </div>

              {/* Subject and due date */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-[#493A55]"
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
                    className="w-full rounded-xl border border-[#E5DDE9] px-4 py-3 text-sm outline-none focus:border-[#806A91] focus:ring-2 focus:ring-[#EAE2F1]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dueDate"
                    className="mb-2 block text-sm font-medium text-[#493A55]"
                  >
                    Due date
                  </label>

                  <input
                    id="dueDate"
                    type="date"
                    min={new Date().toLocaleDateString("en-CA")}
                    value={dueDate}
                    onChange={(event) => {
                      setDueDate(event.target.value);
                      setError("");
                    }}
                    className="w-full rounded-xl border border-[#E5DDE9] px-4 py-3 text-sm outline-none focus:border-[#806A91] focus:ring-2 focus:ring-[#EAE2F1]"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="priority"
                  className="mb-2 block text-sm font-medium text-[#493A55]"
                >
                  Priority
                </label>

                <select
                  id="priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  className="w-full rounded-xl border border-[#E5DDE9] bg-white px-4 py-3 text-sm outline-none focus:border-[#806A91] focus:ring-2 focus:ring-[#EAE2F1]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Error message */}
              {error && (
                <p role="alert" className="text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              {/* Form actions */}
              <div className="flex justify-end gap-3 border-t border-[#F0EBE6] pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-[#E5DDE9] px-5 py-3 text-sm font-semibold text-[#766F78] transition hover:bg-[#F8F5FA]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#3B3044] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#51425B]"
                >
                  {editingTaskId !== null ? "Save changes" : "Save task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search, filter, and sort */}
      <section className="rounded-2xl border border-[#EAE4DE] bg-white p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-medium text-[#493A55]"
            >
              Search tasks
            </label>

            <input
              id="search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title or subject..."
              className="w-full rounded-xl border border-[#E5DDE9] px-4 py-3 text-sm outline-none focus:border-[#806A91] focus:ring-2 focus:ring-[#EAE2F1]"
            />
          </div>

          {/* Filter */}
          <div>
            <label
              htmlFor="filter"
              className="mb-2 block text-sm font-medium text-[#493A55]"
            >
              Filter by
            </label>

            <select
              id="filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="w-full rounded-xl border border-[#E5DDE9] bg-white px-4 py-3 text-sm outline-none focus:border-[#806A91] focus:ring-2 focus:ring-[#EAE2F1]"
            >
              <option value="All">All tasks</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="High">High priority</option>
              <option value="Medium">Medium priority</option>
              <option value="Low">Low priority</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label
              htmlFor="sort"
              className="mb-2 block text-sm font-medium text-[#493A55]"
            >
              Sort by
            </label>

            <select
              id="sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full rounded-xl border border-[#E5DDE9] bg-white px-4 py-3 text-sm outline-none focus:border-[#806A91] focus:ring-2 focus:ring-[#EAE2F1]"
            >
              <option value="dueDate">Due date</option>
              <option value="priority">Priority</option>
              <option value="title">Title (A–Z)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0EBE6] pt-4">
          <p className="text-xs text-[#938B94]">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setFilter("All");
              setSortBy("dueDate");
            }}
            className="text-xs font-semibold text-[#806A91] hover:underline"
          >
            Clear filters
          </button>
        </div>
      </section>

      {/* Task list */}
      <section className="rounded-2xl border border-[#EAE4DE] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#302B32]">All tasks</h2>

            <p className="mt-1 text-sm text-[#938B94]">
              Your current study activities
            </p>
          </div>

          <span className="text-xs font-medium text-[#938B94]">
            {pendingCount} pending · {completedCount} completed
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-[#EEE9E5] p-4 transition hover:border-[#D9C9E5] sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#806A91]"
                    aria-label={`Mark ${task.title} as ${
                      task.completed ? "pending" : "completed"
                    }`}
                  />

                  <div className="min-w-0">
                    <h3
                      className={`break-words font-semibold ${
                        task.completed
                          ? "text-[#938B94] line-through"
                          : "text-[#302B32]"
                      }`}
                    >
                      {task.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#938B94]">
                      {task.subject} · Due {task.dueDate}
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-lg px-3 py-1 text-xs font-semibold ${
                        task.priority === "High"
                          ? "bg-[#F1E1E3] text-[#79505F]"
                          : task.priority === "Medium"
                            ? "bg-[#EAE2F1] text-[#685675]"
                            : "bg-[#E9ECE5] text-[#58634F]"
                      }`}
                    >
                      {task.priority} priority
                    </span>

                    <span
                      className={`ml-2 inline-block rounded-lg px-3 py-1 text-xs font-semibold ${
                        task.completed
                          ? "bg-[#E9ECE5] text-[#58634F]"
                          : "bg-[#F8F0E4] text-[#947343]"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Edit and delete buttons */}
                <div className="flex shrink-0 gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleEditTask(task)}
                    className="rounded-lg border border-[#E5DDE9] px-3 py-2 text-xs font-semibold text-[#685675] transition hover:bg-[#F4EFF7]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="rounded-lg border border-[#EBD9DE] px-3 py-2 text-xs font-semibold text-[#965E6E] transition hover:bg-[#F8EAED]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl bg-[#F8F5FA] px-5 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAE2F1] text-xl text-[#806A91]">
                ✦
              </div>

              <p className="text-sm font-semibold text-[#493A55]">
                No tasks found
              </p>

              <p className="mt-2 max-w-sm text-xs leading-5 text-[#938B94]">
                There are no tasks matching your search or selected filter. Try
                changing your search or clearing the filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default TasksPage;
