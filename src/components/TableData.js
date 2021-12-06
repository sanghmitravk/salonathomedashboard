import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import { columns } from "../config";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { UserForm } from "./UserForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const TableData = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = mm + "-" + dd + "-" + yyyy;

  const initialValue = {
    status: "",
    date_created: today,
    order_key: "",
    total: "",
    id: "",
    billing: {
      first_name: "",
      last_name: "",
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      postcode: "",
      // countr: '',,
      email: "",
      phone: "",
    },
    iconic_delivery_meta: {
      date: today,
      timeslot: "",
    },
    line_items: {
      name: "",
      quantity: "",
      line_items: "",
    },
  };

  const fetchOrders = () => {
    axios.get("http://localhost:5000/order").then((res) => setOrders(res.data));
  };

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const handleOpenUpdate = () => setOpenUpdate(true);
  const handleCloseUpdate = () => setOpenUpdate(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Button
        variant="contained"
        endIcon={<AddIcon />}
        style={{ marginBottom: "20px" }}
        onClick={handleOpenAdd}
      >
        Add an Appoinment
      </Button>
      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <UserForm initialValue={initialValue} request="add" />
        </Box>
      </Modal>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "440" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: 800 }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders &&
                orders.length > 0 &&
                orders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {columns.map((column) => {
                          const { billing, line_items, iconic_delivery_meta } =
                            order;

                          const fetchBillingAddress = (id) => {
                            if (id === "address_1") {
                              return (
                                billing[id] +
                                " " +
                                billing["address_2"] +
                                " " +
                                billing["postcode"] +
                                " " +
                                billing["city"]
                              );
                            } else {
                              return billing[id];
                            }
                          };

                          const fetchServices = (id) => {
                            if (id === "quantity") {
                              return line_items.quantity;
                            }
                            if (id === "name") {
                              return (
                                <p>
                                  <strong>{line_items.name}</strong> <br />
                                  {line_items.display_value}
                                </p>
                              );
                            }
                          };

                          const fetchData = (id) => {
                            if (
                              typeof order[id] === "string" ||
                              typeof order[id] === "number"
                            ) {
                              return order[id];
                            } else {
                              if (id === "quantity" || id === "name") {
                                return fetchServices(id);
                              } else {
                                if (id === "timeslot" || id === "date") {
                                  return iconic_delivery_meta[id];
                                } else {
                                  return fetchBillingAddress(id);
                                }
                              }
                            }
                          };

                          return (
                            <TableCell key={column.id} align={column.align}>
                              {fetchData(column.id)}
                            </TableCell>
                          );
                        })}
                        <TableCell key={order.id}>
                          <Button onClick={handleOpenUpdate}>
                            <EditIcon style={{ cursor: "pointer" }} />
                          </Button>
                          <Modal
                            open={openUpdate}
                            onClose={handleCloseUpdate}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
                              <UserForm initialValue={order} request="update" />
                            </Box>
                          </Modal>
                        </TableCell>
                        <TableCell key={order.order_key}>
                          <a
                            rel="noreferrer"
                            target="_blank"
                            href={`https://api.whatsapp.com/send?phone=91${order.billing.phone}&text=${order.id}%0A${order.billing.first_name}%0A${order.iconic_delivery_meta.date}%0A${order.billing.address_1}%0A${order.billing.address_2}%0A${order.iconic_delivery_meta.timeslot}%0A${order.total}%0Ahttps://salonathome.in/checkout/order-received/${order.id}/?key=${order.order_key}%0A*${order.line_items.name}*%0A${order.line_items.display_value}`}
                          >
                            <WhatsAppIcon style={{ cursor: "pointer" }} />
                          </a>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};
