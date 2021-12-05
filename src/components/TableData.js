import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { columns } from "../config";

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: "https://salonathome.in",
  consumerKey: "ck_ac52674af98deeebdd0888545dc5a5c513208d0a",
  consumerSecret: "cs_f0719735c0f06c2422feb93afe289d1fce1926d4",
  version: "wc/v3",
});

export const TableData = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  let fetchOrders = () => {
    api
      .get("orders", {
        per_page: 20,
      })
      .then((response) => {
        if (response.status === 200) {
          setOrders(response.data);
          console.log("orders", orders);
        }
      })
      .catch((error) => {});
  };

  const rows = orders;

  console.log("rows", rows);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [value, setvalue] = useState();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: "auto" }}>
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const { billing, line_items, iconic_delivery_meta } = row;

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
                          // line_items.map(x => )
                          return line_items.length;
                        }
                        if (id === "name") {
                          let services;
                          services = line_items.map((service) =>
                            service.meta_data.map((displayValue) => {
                              return (
                                <p>
                                  <strong>{service.name}</strong> <br />
                                  {displayValue.display_value}
                                </p>
                              );
                            })
                          );
                          return services;
                        }
                      };

                      const fetchData = (id) => {
                        if (
                          typeof row[id] === "string" ||
                          typeof row[id] === "number"
                        ) {
                          return row[id];
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
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
