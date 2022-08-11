/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: PendingOrders
// ====================================================

export interface PendingOrders_pendingOrders_customer {
  __typename: "User";
  email: string;
}

export interface PendingOrders_pendingOrders_driver {
  __typename: "User";
  email: string;
}

export interface PendingOrders_pendingOrders_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface PendingOrders_pendingOrders {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  customer: PendingOrders_pendingOrders_customer | null;
  driver: PendingOrders_pendingOrders_driver | null;
  restaurant: PendingOrders_pendingOrders_restaurant | null;
}

export interface PendingOrders {
  pendingOrders: PendingOrders_pendingOrders;
}
