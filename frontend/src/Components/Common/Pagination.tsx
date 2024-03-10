import type { statusType } from "../../Common/utils";

import { useEffect, useState } from "react";

import { useAbortableEffect } from "../../Common/utils";

interface PaginationProps {
  data: { totalCount: number };
  onChange: (page: number, rowsPerPage: number) => void;
  defaultPerPage: number;
  cPage: number;
}
const Pagination = (props: PaginationProps) => {
  const { data, onChange } = props;
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const overflowDiv = document.querySelector("#pages");

    if (overflowDiv) {
      overflowDiv.scrollTo(0, 0);
    }
  }, [currentPage]);

  useAbortableEffect(
    (status: statusType) => {
      if (!status.aborted) {
        if (props.defaultPerPage) {
          setRowsPerPage(props.defaultPerPage);
        }
        if (props.cPage) {
          setCurrentPage(parseInt(`${props.cPage}`));
        }
      }
    },
    [props]
  );

  const getPageNumbers = () => {
    const totalPage = Math.ceil(data.totalCount / rowsPerPage);
    const pageNumbers = [];

    if (totalPage === 0) {
      return [1];
    }

    if (currentPage === 1 && currentPage === totalPage) {
      pageNumbers.push(currentPage);
    } else if (currentPage === totalPage) {
      let tempPage = currentPage;
      let pageLimit = 3;

      while (tempPage >= 1 && pageLimit > 0) {
        pageNumbers.push(tempPage);
        tempPage--;
        pageLimit--;
      }
    } else {
      pageNumbers.push(currentPage);
      if (currentPage > 1) {
        pageNumbers.push(currentPage - 1);
        if (currentPage + 1 <= totalPage) {
          pageNumbers.push(currentPage + 1);
        }
      } else {
        pageNumbers.push(currentPage + 1);
        if (currentPage + 2 <= totalPage) {
          pageNumbers.push(currentPage + 2);
        }
      }
    }

    return pageNumbers.sort((a, b) => a - b);
  };

  const handleChangePage = (action: any) => {
    let newPage = 1;
    const totalPage = Math.ceil(data.totalCount / rowsPerPage);

    switch (action) {
      case "<":
        newPage = currentPage - 1;
        break;

      case ">":
        newPage = currentPage + 1;
        break;

      case ">>>":
        newPage = totalPage;
        break;

      default:
        break;
    }

    setCurrentPage(newPage);
    onChange(newPage, rowsPerPage);
  };

  const goToPage = (page: any) => {
    setCurrentPage(page);
    onChange(page, rowsPerPage);
  };

  const renderNavigationBtn = (label: any, disabled: any, classes: string) => {
    return (
      <button
        className={`${classes} relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-5 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-200 hover:text-gray-800 focus:z-10 focus:border-zinc-300 focus:outline-none focus:ring-zinc-500  ${
          !disabled ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        disabled={disabled}
        onClick={() => handleChangePage(label.toLowerCase())}
      >
        {label}
      </button>
    );
  };

  const { totalCount } = data;

  if (!totalCount) {
    return null;
  }
  const totalPage = Math.ceil(totalCount / rowsPerPage);
  const pageNumbers = getPageNumbers();
  const firstBtnDisable = currentPage === 1;
  const prevBtnDisable = currentPage - 1 <= 0;
  const nextBtnDisable = currentPage + 1 >= totalPage;
  const lastBtnDisable = totalPage === 0 || currentPage === totalPage;

  return (
    <div className="mx-auto mb-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          className="relative inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out hover:text-gray-500 focus:border-zinc-300 focus:outline-none focus:ring-zinc-500 active:bg-gray-100 active:text-gray-700"
          disabled={firstBtnDisable}
          onClick={() => handleChangePage("<")}
        >
          {"<"}
        </button>
        <button
          className="relative ml-3 inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out hover:text-gray-500 focus:border-zinc-300 focus:outline-none focus:ring-zinc-500 active:bg-gray-100 active:text-gray-700"
          disabled={lastBtnDisable}
          onClick={() => handleChangePage(">")}
        >
          {">"}
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <nav className="relative z-0 inline-flex shadow-sm">
            {renderNavigationBtn("<<<", firstBtnDisable, "rounded-l-md")}
            {renderNavigationBtn("<", prevBtnDisable, "")}
            {pageNumbers.map((pageNo) => (
              <button
                key={`page_${pageNo}`}
                className={`relative -ml-px inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:z-10 focus:border-zinc-300 focus:outline-none focus:ring-zinc-500 ${
                  currentPage === pageNo
                    ? "bg-zinc-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                }`}
                type="button"
                onClick={() => goToPage(pageNo)}
              >
                {pageNo}
              </button>
            ))}
            {renderNavigationBtn(">", nextBtnDisable, "")}
            {renderNavigationBtn(">>>", lastBtnDisable, "rounded-r-md")}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
