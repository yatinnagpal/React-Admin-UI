import React, { useState, useEffect, useMemo } from "react";
import { useTable, usePagination } from "react-table";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";

const AdminTable = () => {
  const [adminData, setAdminData] = useState([]);
  const [enableDelete, setEnableDelete] = useState(true);

  useEffect(() => {
    axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((res) => {
        const fetchedData = res.data;
        const initializedData = fetchedData.map((item) => ({
          ...item,
          isEditing: false,
          isSelected: false,
        }));
        setAdminData(initializedData);
      })
      .catch((err) => {
        console.log("error", err);
      });
  }, []);

  const handleInputChange = (rowIndex, columnId, value) => {
    let newData = [...adminData];
    newData[rowIndex][columnId] = value;
    setAdminData(newData);
  };

  const handleEdit = (rowIndex) => {
    let newData = [...adminData];
    newData[rowIndex].isEditing = !newData[rowIndex].isEditing;
    setAdminData(newData);
  };

  const handleDelete = (rowIndex) => {
    let newData = [...adminData];
    newData.splice(rowIndex, 1);
    setAdminData(newData);
  };

  const handleSelectedRow = (rowIndex) => {
    let newData = [...adminData];
    newData[rowIndex].isSelected = !newData[rowIndex].isSelected;
    let enableDelete = newData.some((val) => val.isSelected);
    setEnableDelete(!enableDelete);
    setAdminData(newData);
  };

  const handleDeleteSelectedRows = () => {
    let newData = adminData.filter((row) => !row.isSelected);
    setAdminData(newData);
  };

  const columns = useMemo(
    () => [
      {
        id: "checkbox",
        Cell: ({ row }) => (
          <Checkbox
            checked={row.original.isSelected}
            onChange={() => handleSelectedRow(row.index)}
          />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) =>
          row.original.isEditing ? (
            <input
              value={row.original.name}
              onChange={(e) =>
                handleInputChange(row.index, "name", e.target.value)
              }
            />
          ) : (
            row.original.name
          ),
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ row }) =>
          row.original.isEditing ? (
            <input
              value={row.original.email}
              onChange={(e) =>
                handleInputChange(row.index, "email", e.target.value)
              }
            />
          ) : (
            row.original.email
          ),
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ row }) =>
          row.original.isEditing ? (
            <input
              value={row.original.role}
              onChange={(e) =>
                handleInputChange(row.index, "role", e.target.value)
              }
            />
          ) : (
            row.original.role
          ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <>
            <IconButton className="edit" onClick={() => handleEdit(row.index)}>
              <EditIcon />
            </IconButton>
            <IconButton
              className="delete"
              onClick={() => handleDelete(row.index)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        ),
      },
    ],
    [adminData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data: adminData, initialState: { pageIndex: 0, pageSize: 10 } },
    usePagination
  );

  return adminData.length > 0 ? (
    <div
      style={{
        height: "80%",
        overflowY: "hidden",
        margin: "5% 5%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <table style={{ flex: 2 }} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} key={column.id}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ flex: 1 }}>
        <Button
          style={{
            backgroundColor: "red",
            color: "white",
            marginRight: "20px",
          }}
          onClick={handleDeleteSelectedRows}
          disabled={enableDelete}
        >
          Delete Selected
        </Button>
        <button
          className="first-page"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>
        <button
          className="previous-page"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>
        {pageOptions.map((pageNum) => (
          <Button
            className="pagination-button"
            key={pageNum}
            onClick={() => gotoPage(pageNum)}
          >
            {pageNum + 1}
          </Button>
        ))}
        <button
          className="next-page"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </button>
        <button
          className="last-page"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
      </div>
    </div>
  ) : (
    <p> Loading Data</p>
  );
};

export default AdminTable;
