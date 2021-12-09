import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { useEffect } from "react";
import axios from "axios";
const api = new WooCommerceRestApi({
  url: "https://salonathome.in",
  consumerKey: "ck_ac52674af98deeebdd0888545dc5a5c513208d0a",
  consumerSecret: "cs_f0719735c0f06c2422feb93afe289d1fce1926d4",
  version: "wc/v3",
});

export const FetchFromWc = () => {
  useEffect(() => {
    fetchOrdersWC();
  }, []);

  const fetchOrdersWC = () => {
    api
      .get("orders", {
        per_page: 100,
      })
      .then((response) => {
        if (response.status === 200) {
          response.data &&  
            response.data.map((order) => {
              return addData(order);
            });
        }
      })
      .catch((error) => {});
  };

  const addData = (order) => {
    let itemNames;
    itemNames = "".concat.apply(
      [],
      order.line_items.map((order) => order.name)
    );

    let displayValueItmes;
    displayValueItmes = "".concat.apply(
      [],
      order.line_items.map((order) =>
        order.meta_data.map((elem) => elem.display_value)
      )
    );
    const myobj = {
      id: order.id,
      status: order.status,
      date_created: order.date_created,
      total: order.total,
      order_key: order.order_key,
      billing: {
        first_name: order.billing.first_name,
        last_name: order.billing.last_name,
        address_1: order.billing.address_1,
        address_2: order.billing.address_2,
        city: order.billing.city,
        state: order.billing.state,
        postcode: order.billing.postcode,
        email: order.billing.email,
        phone: order.billing.phone,
      },
      line_items: {
        display_value: displayValueItmes,
        quantity: order.line_items.length,
        name: itemNames,
      },
      iconic_delivery_meta: {
        date: order.iconic_delivery_meta.date,
        timeslot: order.iconic_delivery_meta.timeslot,
      },
    };
    axios
      .post(`${BASE_URI}order/add`, myobj)
      .then((res) => console.log(res.data));
  };
  return <div></div>;
};
