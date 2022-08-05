/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderUpdatesInput, OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: OrderUpdatesSubscription
// ====================================================

export interface OrderUpdatesSubscription_orderUpdates_customer {
  __typename: "User";
  email: string;
}

export interface OrderUpdatesSubscription_orderUpdates_driver {
  __typename: "User";
  email: string;
}

export interface OrderUpdatesSubscription_orderUpdates_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface OrderUpdatesSubscription_orderUpdates {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  customer: OrderUpdatesSubscription_orderUpdates_customer | null;
  driver: OrderUpdatesSubscription_orderUpdates_driver | null;
  restaurant: OrderUpdatesSubscription_orderUpdates_restaurant | null;
}

export interface OrderUpdatesSubscription {
  orderUpdates: OrderUpdatesSubscription_orderUpdates;
}

export interface OrderUpdatesSubscriptionVariables {
  input: OrderUpdatesInput;
}
