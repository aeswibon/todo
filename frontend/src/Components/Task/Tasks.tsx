import loadable from "@loadable/component";
import CancelIcon from "@mui/icons-material/Cancel";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";
import { navigate, useQueryParams } from "raviger";
import React from "react";

import routes from "../../Redux/api";
import useQuery from "../../Utils/request/useQuery";
import { Task } from "../../types/task";
import Button from "../Common/Button";
import Pagination from "../Common/Pagination";
import { InputSearchBox } from "../Common/SearchBox";

const Loading = loadable(() => import("../Common/Loading"));
const PageTitle = loadable(() => import("../Common/PageTitle"));

const statusColor = [
  { text: "DONE", color: "bg-black" },
  { text: "IN_PROGRESS", color: "bg-green-700" },
  { text: "TODO", color: "bg-yellow-700" },
];

export const Tasks = () => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const [offset, setOffset] = React.useState(0);
  const [qParams, setQueryParams] = useQueryParams();
  const limit = 10;

  const { data: taskList, loading: isLoading } = useQuery(routes.getTasks, {
    query: {
      title: qParams.title || "",
      limit,
      offset,
    },
  });

  const updateQuery = (params: any) => {
    const nParams = Object.assign({}, qParams, params);

    setQueryParams(nParams, { replace: true });
  };

  const onSearchSuspects = (value: string) => {
    updateQuery({ title: value });
  };

  const statusBadge = (status: string) => {
    const number = status === "DONE" ? 0 : status === "IN_PROGRESS" ? 1 : 2;

    return (
      <div
        className={clsx(
          "rounded-lg border border-zinc-600 bg-zinc-100 px-3 py-1 text-sm font-semibold text-white",
          number > 3 ? "bg-gray-900" : statusColor[number].color
        )}
      >
        {statusColor[number].text || "Undefined"}
      </div>
    );
  };

  const removeFilter = (paramKey: string) => {
    updateQuery({
      ...qParams,
      [paramKey]: "",
    });
  };

  const badge = (key: string, value: string, paramKey: string) => {
    return (
      value && (
        <span className="inline-flex h-full items-center rounded-full border bg-white px-3 py-1 text-xs font-medium leading-4 text-gray-600">
          {key}
          {": "}
          {value}
          <CancelIcon
            style={{ color: "#a1a1aa" }}
            onClick={(_) => removeFilter(paramKey)}
          />
        </span>
      )
    );
  };

  const handlePagination = (page: number, limit: number) => {
    const offset = (page - 1) * limit;

    setCurrentPage(page);
    setOffset(offset);
  };

  let tasks: React.ReactNode[] = [];

  if (taskList && taskList.results.length) {
    tasks = taskList.results.map((b: Task, idx) => (
      <div key={idx}>
        <div className="block w-3/4 h-full rounded-lg bg-white shadow hover:border-teal-500">
          <div className="flex h-full">
            <div className="h-full w-full grow px-2">
              <div className="flex h-full w-full flex-col justify-between">
                <div className="w-full px-4 py-2">
                  <div className="flow-root">
                    <div className="float-left text-xl font-bold capitalize">
                      {b.title}
                    </div>
                    <div className="float-right">
                      {statusBadge(b.status || "TODO")}{" "}
                    </div>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <div className="flex flex-col">
                      <div className="font-semibold">{b?.description}</div>
                    </div>
                  </div>
                </div>
                <div className="flex-none border-t bg-gray-50 p-2">
                  <div className="flex justify-between py-4">
                    <div className="flex w-full flex-wrap justify-between gap-2">
                      <div className="flex items-center">
                        <div className="inline-flex gap-4 items-center">
                          <Button
                            variant="warning"
                            onClick={() => navigate(`/task/${b.uuid}/update`)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => navigate(`/task/${b.uuid}/delete`)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2 ">
                        <div className="inline-flex items-center rounded-md border border-teal-500 bg-white px-3 py-2 text-sm font-medium leading-4 text-teal-700 transition duration-150 ease-in-out hover:text-teal-500 hover:shadow focus:border-teal-300 focus:outline-none focus:ring-blue-300 active:bg-gray-50 active:text-teal-800">
                          {b.due_date
                            ?.substring(0, 10)
                            .split("-")
                            .reverse()
                            .join("-")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  }

  let manageTask: React.ReactNode = null;

  if (isLoading || !taskList) {
    manageTask = <Loading />;
  } else if (taskList && taskList.results.length) {
    manageTask = (
      <>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">{tasks}</div>
        {taskList.count > limit && (
          <div className="mt-4 flex w-full justify-center">
            <Pagination
              cPage={currentPage}
              data={{ totalCount: taskList.count }}
              defaultPerPage={limit}
              onChange={handlePagination}
            />
          </div>
        )}
      </>
    );
  } else if (taskList && taskList.results.length === 0) {
    manageTask = (
      <div className="w-full rounded-lg p-3">
        <div className="mt-4 flex w-full  justify-center text-2xl font-bold text-gray-600">
          No Tasks
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 pb-2">
      <PageTitle hideBack breadcrumbs={false} title="Tasks" />
      <div className="mt-4 gap-2 lg:flex">
        <div className="min-w-fit flex-1 overflow-hidden rounded-lg bg-white shadow md:mr-2">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="truncate text-sm font-medium leading-5 text-gray-500">
                Total Tasks
              </dt>
              {isLoading ? (
                <dd className="mt-4 text-5xl leading-9">
                  <CircularProgress className="text-teal-500" />
                </dd>
              ) : (
                <dd className="mt-4 text-5xl font-semibold leading-9 text-gray-900">
                  {taskList?.count}
                </dd>
              )}
            </dl>
          </div>
        </div>
        <div className="mb-4 flex grow flex-col justify-between gap-2 md:flex-row">
          <div className="w-full md:w-72">
            <InputSearchBox
              errors=""
              placeholder="Search Task"
              search={onSearchSuspects}
              value={qParams.title}
            />
          </div>
          <div className="mb-2 flex w-full items-start md:w-auto">
            <Button variant="primary" onClick={() => navigate("/task/add")}>
              <div className="text-xl">Create Task</div>
            </Button>
          </div>
        </div>
      </div>
      <div className="col-span-3 my-2 flex w-full flex-wrap items-center gap-2">
        {badge("Task Name", qParams.title, "title")}
      </div>
      <div className="mt-4 pb-4">
        <div>{manageTask}</div>
      </div>
    </div>
  );
};
