import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import initialTasks from "../data/initialTasks";

const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage("studyflow-tasks", initialTasks);

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error("useTasks must be used inside TasksProvider");
  }

  return context;
}
