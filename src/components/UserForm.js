import {
  Button,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  Box,
  FormControl,
} from "@mui/material";
import { Formik } from "formik";
import axios from "axios";
import { BASE_URI } from './config';

export const UserForm = (initialValue) => {
  console.log("props value", initialValue.initialValue);
  const method = initialValue.request;
  const {
    billing,
    total,
    id,
    status,
    date_created,
    order_key,
    line_items,
    iconic_delivery_meta,
  } = initialValue.initialValue;
  const {
    first_name,
    last_name,
    address_1,
    address_2,
    city,
    state,
    postcode,
    email,
    phone,
  } = billing;

  const { date, timeslot } = iconic_delivery_meta;
  const { name, display_value, quantity } = line_items;

  const appoinmentdate = date;

  return (
    <Formik
      initialValues={{
        id: id,
        firstname: first_name,
        lastname: last_name,
        address_1: address_1,
        address_2: address_2,
        city: city,
        state: state,
        postcode: postcode,
        email: email,
        phone: phone,
        total: total,
        status: status,
        date_created: date_created,
        order_key: order_key,
        appoinmentdate: appoinmentdate,
        timeslot: timeslot,
        numberofservices: quantity,
        nameofservice: name,
        display_value: display_value,
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        const content = {
          status: values.status,
          date_created: values.date_created,
          order_key: values.order_key,
          total: values.total,
          id: id,
          billing: {
            first_name: values.firstname,
            last_name: values.lastname,
            address_1: values.address_1,
            address_2: values.address_2,
            city: values.city,
            state: values.state,
            postcode: values.postcode,
            email: values.email,
            phone: values.phone,
            total: values.total,
          },
          iconic_delivery_meta: {
            date: values.appoinmentdate,
            timeslot: values.timeslot,
          },
          line_items: {
            name: values.nameofservice,
            quantity: values.numberofservices,
            display_value: values.display_value,
          },
        };

        const updateData = () => {
          axios
            .post(
              `${BASE_URI}update/${initialValue.initialValue._id}`,
              content
            )
            .then((res) => console.log(res.data));
          setSubmitting(false);
          resetForm();
        };

        const addData = () => {
          axios
            .post(`${BASE_URI}order/add`, content)
            .then((res) => console.log(res.data));
        };
        method === "add" ? addData() : updateData();
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} style={{ width: "500px" }}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                type="text"
                name="firstname"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstname || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                type="text"
                name="lastname"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastname || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Address 1"
                type="text"
                name="address_1"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address_1 || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Address 2"
                type="text"
                name="address_2"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address_2 || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="City"
                type="text"
                name="city"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.city || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="State"
                type="text"
                name="state"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.state || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Postcode"
                type="number"
                name="postcode"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.postcode || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                type="text"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Phone"
                type="number"
                name="phone"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Amount"
                type="number"
                name="total"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.total || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Satus</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    name="status"
                    id="demo-simple-select"
                    value={values.status || ""}
                    label="Status"
                    onChange={handleChange}
                  >
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="on-hold">On Hold</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <TextField
                inputProps={{ readOnly: true }}
                id="datetime-local"
                name="date_created"
                label="Date of Creation"
                type="datetime-local"
                defaultValue={values.date_created}
                // value={values.date || ""}
                sx={{ width: "100%" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                inputProps={{ readOnly: true }}
                label="Order Key"
                type="text"
                name=" order_key"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.order_key || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                inputProps={{ readOnly: true }}
                label="Order id"
                type="text"
                name="id"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.id || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="appoinmentdate"
                label="Date of an Appoinment"
                type="date"
                name=" appoinmentdate"
                defaultValue={values.appoinmentdate}
                // value={values.appoinmentdate}
                sx={{ width: "100%" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Time Slot"
                type="text"
                name=" timeslot"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.timeslot || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                multiline
                id="outlined-multiline-static"
                rows={4}
                label="Name of Service"
                type="text"
                name="nameofservice"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.nameofservice || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                multiline
                id="outlined-multiline-static"
                rows={4}
                label="Services inclues"
                type="text"
                name="display_value"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.display_value || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Services Quantity"
                type="number"
                name="numberofservices"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.numberofservices || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};
