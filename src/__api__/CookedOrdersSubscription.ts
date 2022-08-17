/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: CookedOrdersSubscription
// ====================================================

export interface CookedOrdersSubscription_cookedOrders_customer {
  __typename: "User";
  email: string;
}

export interface CookedOrdersSubscription_cookedOrders_driver {
  __typename: "User";
  email: string;
}

export interface CookedOrdersSubscription_cookedOrders_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface CookedOrdersSubscription_cookedOrders {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  customer: CookedOrdersSubscription_cookedOrders_customer | null;
  driver: CookedOrdersSubscription_cookedOrders_driver | null;
  restaurant: CookedOrdersSubscription_cookedOrders_restaurant | null;
}

export interface CookedOrdersSubscription {
  cookedOrders: CookedOrdersSubscription_cookedOrders;
}
