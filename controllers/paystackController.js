import asyncHandler from "express-async-handler";
import https from "https";
import Products from "../models/product.js";

export const paystack = asyncHandler(async (req, res) => {
  const { email, price } = req.body;

  const params = JSON.stringify({
    email: email,
    amount: price * 100,
    currency: "NGN",
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.PAYSTACK_PAYMENT,
      "Content-Type": "application/json",
    },
  };

  const reqPayStack = https
    .request(options, (resPayStack) => {
      let data = "";

      resPayStack.on("data", (chunk) => {
        data += chunk;
      });

      resPayStack.on("end", () => {
        const responseData = JSON.parse(data);
        if (responseData.status === "success" || "successful") {
          // Payment initiated successfully
          res.json(responseData);
          console.log(responseData);
          // res.redirect("http://localhost:5173/order");
        } else {
          // Payment initiation failed
          res.status(400).json({ error: "Payment initiation failed" });
          // res.redirect("http://localhost:5173/checkout");
        }
      });
    })
    .on("error", (error) => {
      console.error(error);
      // console.log(error);
    });

  reqPayStack.write(params);
  reqPayStack.end();
});

export const getPayment = asyncHandler(async (req, res) => {
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction`,
    method: "GET",
    headers: {
      Authorization: "Bearer " + process.env.PAYSTACK_PAYMENT,
    },
  };

  const request = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const paymentDetails = JSON.parse(data);
      res.json(paymentDetails);
      // console.log(paymentDetails);
      // res.redirect("http://localhost:5173/");
    });
  });

  request.on("error", (error) => {
    console.error(error);
    res.status(500).json({ message: "Error fetching payment details" });
  });

  request.end();
});

export const verifyPaymentDetails = asyncHandler(async (req, res) => {
  const { verifyId } = req.params();

  if (!verifyId) {
    return res.status(400).json({ message: "Missing verify ID" }); // Handle missing verifyId
  }

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${verifyId}`,
    method: "GET",
    headers: {
      Authorization: "Bearer " + process.env.PAYSTACK_PAYMENT,
    },
  };

  https
    .request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });
});
