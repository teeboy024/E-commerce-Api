import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/usersRoutes.js';
import { globalErrhandler, notFound } from '../middlewares/globalErrHandler.js';
import productsRouter from '../routes/productRoutes.js';
import categoriesRouter from '../routes/categoriesRoutes.js';
import brandsRouter from '../routes/brandRoutes.js';
import colorRouter from '../routes/colorRoutes.js';
import reviewRouter from '../routes/reviewRoutes.js';
import orderRouter from '../routes/orderRoutes.js';
import Stripe from 'stripe';
import Order from '../model/Order.js';
import couponRouter from '../routes/couponRoutes.js';



//dbconnect
dbConnect()
const app = express();

//stipe instance
const stripe = new Stripe(process.env.STRIPE_KEY)

//this is your stripe cli webhook for testing your end point locally
const endpointSecret = "whsec_993e4d8cc70abb2ab4b1d32069a20ad0ae2b9882ecbb4d4bfa5735e27ef08638";

//stripe webhook
app.post("/webhook",express.raw({ type: "application/json" }),async (request, response) => {
      const sig = request.headers["stripe-signature"];
  
      let event;
      try {event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        // console.log(event);
      } catch (err) {
        // console.log("err", err.message);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
  
      if (event.type === "checkout.session.completed") {
        //update the order
        const session = event.data.object;
  
        const { orderId } = session.metadata;
        const paymentStatus = session.payment_status;
        const paymentMethod = session.payment_method_types[0];
        const totalAmount = session.amount_total;
        const currency = session.currency;
        // console.log({orderId,paymentStatus,paymentMethod,totalAmount,currency})
        //find the order
        const order = await Order.findByIdAndUpdate(
          JSON.parse(orderId),
          {
            totalPrice: totalAmount / 100,
            currency: currency,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
          },
          { new: true }
        );
        console.log(order);
      } else {
        return;
      }
      //Handle the event
      // switch (event.type) {
      //   case "payment_intent.succeeded":
      //     const paymentIntent = event.data.object;
      //     //The define and call a function to handle the event payment_intent.succeeded
      //     break;
      //   // ... handle other event types
      //   default:
      //     console.log(Unhandled event type ${event.type});
      // }
      // Return a 200 response to acknowledge receipt of the event
      response.send();
    }
  );
//pass incoming data 
app.use(express.json());
//routes 
app.use('/api/v1/users',userRoutes) 
app.use('/api/v1/products',productsRouter) 
app.use('/api/v1/categories',categoriesRouter) 
app.use('/api/v1/brands',brandsRouter) 
app.use('/api/v1/colors',colorRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/orders',orderRouter)
app.use('/api/v1/coupon',couponRouter)




//err middleware 
app.use(notFound)
app.use(globalErrhandler)
export default app