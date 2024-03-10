import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

import { navigate } from "raviger";
import routes from "../../Redux/api";
import * as Notification from "../../Utils/Notification.js";
import request from "../../Utils/request/request";
import useQuery from "../../Utils/request/useQuery";
import Button from "../Common/Button";

interface IProps {
  taskId: string;
}

export const DeleteTask = (props: IProps) => {
  const { taskId } = props;

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(true);

  const { data: task } = useQuery(routes.getTask, {
    pathParams: { uuid: taskId },
  });

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    navigate("/");
  };

  const handleDeleteSubmit = async () => {
    if (task?.uuid) {
      const { res, error } = await request(routes.deleteTask, {
        pathParams: { uuid: task.uuid },
      });

      if (res?.status === 204) {
        Notification.Success({
          msg: "Task deleted successfully",
        });
      } else {
        Notification.Error({
          msg: `Error while deleting Task: ${
            error?.message || "Unknown error"
          }`,
        });
      }
    }
    setOpenDeleteDialog(false);
    navigate("/");
  };

  return (
    <div>
      <Dialog
        maxWidth={"md"}
        open={openDeleteDialog}
        onClose={handleDeleteClose}
      >
        <DialogTitle className="flex justify-center bg-red-100">
          Are you sure you want to delete {task?.title || "Task"}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will not be able to view this task after it is deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className="flex w-full flex-col justify-between gap-2 md:flex-row">
            <Button variant="danger" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDeleteSubmit}>
              Delete
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};
