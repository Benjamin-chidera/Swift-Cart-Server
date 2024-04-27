import asyncHandler from "express-async-handler";
import https from "https";
import Products from "../models/product.js";

export const paystack = asyncHandler(async (req, res) => {
  const { email, price } = req.body;

  const params = JSON.stringify({
    email: email,
    amount: price * 100,
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
        res.send(data);
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });

  reqPayStack.write(params);
  reqPayStack.end();
});

export const getPayment = asyncHandler(async (req, res) => {
  // const { id } = req.params; // Assuming you're passing the transaction ID as a URL parameter

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction`, // Include the transaction ID in the path
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
      res.json(paymentDetails); // Send the payment details back to the client
      console.log(paymentDetails); // Log the payment details
    });
  });

  request.on("error", (error) => {
    console.error(error);
    res.status(500).json({ message: "Error fetching payment details" });
  });

  request.end();
});
