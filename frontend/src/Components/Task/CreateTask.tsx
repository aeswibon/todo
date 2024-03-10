import loadable from "@loadable/component";
import Close from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import moment from "moment";
import { navigate } from "raviger";
import { useReducer, useState } from "react";

import useWindowDimensions from "../../Common/hooks/useWindowDimensions";
import routes from "../../Redux/api";
import * as Notification from "../../Utils/Notification";
import request from "../../Utils/request/request";
import useQuery from "../../Utils/request/useQuery";
import { Task } from "../../types/task";
import Button from "../Common/Button";
import DateFormField from "../Common/Form/FormFields/DateFormField";
import { SelectFormField } from "../Common/Form/FormFields/SelectFormField";
import TextFormField from "../Common/Form/FormFields/TextFormField";
import { FieldChangeEvent } from "../Common/Form/FormFields/Utils";
import Modal from "../Common/Modal";

const Loading = loadable(() => import("../Common/Loading"));

const initForm: Task = {
  title: "",
  description: "",
  status: "TODO",
  due_date: moment().format("YYYY-MM-DD"),
};

const initError: Record<keyof Task, string> = Object.assign(
  {},
  ...Object.keys(initForm).map((k) => ({ [k]: "" }))
);

const initialState = {
  errors: { ...initError },
  form: { ...initForm },
};

type SetFormAction = { type: "set_form"; form: Task };
type SetErrorAction = {
  type: "set_error";
  errors: Record<keyof Task, string>;
};
type TaskCreateFormAction = SetFormAction | SetErrorAction;

const activity_reducer = (
  state = initialState,
  action: TaskCreateFormAction
) => {
  switch (action.type) {
    case "set_form":
      return { ...state, form: action.form };
    case "set_error":
      return { ...state, errors: action.errors };
  }
};

type CreateTaskProps = {
  taskId?: string;
};

export const CreateTask = (props: CreateTaskProps) => {
  const { taskId } = props;
  const [stateForm, dispatch] = useReducer(activity_reducer, initialState);
  const [openTask, setOpenTask] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();

  const headerText = !taskId ? "Create Task" : "Update Task";
  const buttonText = !taskId ? "Save Task" : "Update Task";

  useQuery(routes.getTask, {
    pathParams: { uuid: taskId || "" },
    prefetch: !!taskId,
    onResponse: ({ res, data }) => {
      if (taskId) {
        setIsLoading(true);
        if (res?.ok && data) {
          const task = {
            title: data.title,
            description: data.description,
            status: data.status,
            due_date: data.due_date,
          };
          dispatch({ form: task, type: "set_form" });
        } else {
          navigate("/");
        }
        setIsLoading(false);
      }
    },
  });

  const handleDateRangeChange = (event: FieldChangeEvent<Date>) => {
    dispatch({
      form: {
        ...stateForm.form,
        [event.name]: moment(event.value).format("YYYY-MM-DD"),
      },
      type: "set_form",
    });
  };

  const handleFormFieldChange = (event: FieldChangeEvent<string>) => {
    dispatch({
      form: {
        ...stateForm.form,
        [event.name]: event.value,
      },
      type: "set_form",
    });
  };

  const validateForm = () => {
    const errors = { ...initError };
    let invalidForm = false;

    Object.keys(stateForm.form).forEach((field) => {
      switch (field) {
        case "title":
        case "description":
        case "due_date":
          if (!stateForm.form[field]) {
            errors[field] = "Field is required";
            invalidForm = true;
          }

          return;
        default:
          return;
      }
    });
    if (invalidForm) {
      dispatch({ errors, type: "set_error" });

      return false;
    }
    dispatch({ errors, type: "set_error" });

    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const validated = validateForm();

    if (validated) {
      setIsLoading(true);
      const data = {
        title: stateForm.form.title,
        description: stateForm.form.description,
        due_date: stateForm.form.due_date,
        status: stateForm.form.status,
      };
      const {
        res,
        data: requestData,
        error,
      } = taskId
        ? await request(routes.updateTask, {
            body: data,
            pathParams: { uuid: taskId },
          })
        : await request(routes.createTask, {
            body: data,
          });
      if (res?.ok && requestData) {
        dispatch({ type: "set_form", form: initForm });
        if (!taskId) {
          Notification.Success({
            msg: "Task added successfully",
          });
        } else {
          Notification.Success({
            msg: "Task updated successfully",
          });
        }
        navigate("/");
      } else {
        console.log("error", error);
        Notification.Error({
          msg: error?.message || "Something went wrong",
        });
      }
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const extremeSmallScreenBreakpoint = 640;
  const isExtremeSmallScreen =
    width <= extremeSmallScreenBreakpoint ? true : false;

  return (
    <Modal closeCB={() => setOpenTask(false)} isOpen={openTask}>
      <div className="w-full max-w-lg divide-y divide-gray-200">
        <div className="flex justify-between">
          <h2 className="my-2 pl-5 text-2xl">{headerText}</h2>
          <IconButton
            aria-label="Close"
            className="fill-current px-4 text-white md:hidden"
            onClick={() => navigate("/")}
          >
            <Close style={{ color: "#52525b" }} />
          </IconButton>
        </div>
        <form className="p-5" onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-2">
            <TextFormField
              error={stateForm.errors.title}
              id="title"
              label={<span className="text-sm">Title</span>}
              name="title"
              placeholder="Title"
              value={stateForm.form.title}
              onChange={handleFormFieldChange}
            />
          </div>
          <div className="mb-2">
            <TextFormField
              error={stateForm.errors.description}
              id="description"
              label={<span className="text-sm">Description</span>}
              name="description"
              placeholder="Description"
              value={stateForm.form.description}
              onChange={handleFormFieldChange}
            />
          </div>
          <div className="mb-4">
            <label className="field-label">
              <span className="text-sm">Status</span>
            </label>
            <SelectFormField
              name="status"
              optionIcon={() => <i className="fas fa-tasks" />}
              optionLabel={(o) => o.text}
              optionValue={(o) => o.value}
              options={[
                {
                  id: 0,
                  text: "Todo",
                  value: "TODO",
                },
                {
                  id: 1,
                  text: "In Progress",
                  value: "IN_PROGRESS",
                },
                {
                  id: 2,
                  text: "Done",
                  value: "DONE",
                },
              ]}
              value={stateForm.form.status}
              onChange={handleFormFieldChange}
            />
          </div>
          <div className="mb-2">
            <DateFormField
              // errorClassName="hidden"
              label={<span className="text-sm">Due Date</span>}
              name="due_date"
              placeholder="Due Date"
              position="TOP"
              value={moment(stateForm.form.due_date, "YYYY-MM-DD").toDate()}
              onChange={handleDateRangeChange}
            />
          </div>

          <div
            className={`${
              isExtremeSmallScreen
                ? " grid grid-cols-1 "
                : " flex justify-between "
            } mt-6 gap-2 `}
          >
            <Button variant="danger" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button variant="primary" onClick={(e) => handleSubmit(e)}>
              {buttonText}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
