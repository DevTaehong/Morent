import { NextResponse } from 'next/server';

import { calculateOrderAmount } from '@/utils/utility.functions';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { data, user } = await req.json();
  const { price, totalDays } = data;
  const userEmail = user.emailAddresses[0].emailAddress;
  const userName = user.username

  // Check if a customer with the given email already exists
  const existingCustomers = await stripe.customers.list({
    email: userEmail,
    limit: 1,
  });

  let customer;

  if (existingCustomers.data.length > 0) {
    // If the customer exists, retrieve it
    customer = existingCustomers.data[0];
  } else {
    // If the customer does not exist, create a new one
    customer = await stripe.customers.create({
      email: userEmail,
      name: userName,
      // add more customer details if needed
    });
  }

  const orderTotal = calculateOrderAmount(totalDays, price);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: orderTotal,
    currency: 'cad',
    setup_future_usage: 'off_session',
    customer: customer.id,
    payment_method_types: ['card'],
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    price,
    totalDays,
  });
}
