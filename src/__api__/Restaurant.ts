/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: Restaurant
// ====================================================

export interface Restaurant_restaurant_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface Restaurant_restaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  address: string;
  isPromoted: boolean;
  category: Restaurant_restaurant_restaurant_category | null;
}

export interface Restaurant_restaurant {
  __typename: "RestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: Restaurant_restaurant_restaurant | null;
}

export interface Restaurant {
  restaurant: Restaurant_restaurant;
}

export interface RestaurantVariables {
  input: RestaurantInput;
}
