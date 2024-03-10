import { CreateTask, DeleteTask, Tasks } from "../../Components/Task";

export default {
  "/": () => <Tasks />,
  "/task/add": () => <CreateTask />,
  "/task/:taskId/update": ({ taskId }: { taskId: string }) => (
    <CreateTask taskId={taskId} />
  ),
  "/task/:taskId/delete": ({ taskId }: { taskId: string }) => (
    <DeleteTask taskId={taskId} />
  ),
};
