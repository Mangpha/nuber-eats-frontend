/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CategoryInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: CategoryQuery
// ====================================================

export interface CategoryQuery_category_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface CategoryQuery_category_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  address: string;
  isPromoted: boolean;
  category: CategoryQuery_category_restaurants_category | null;
}

export interface CategoryQuery_category_category {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface CategoryQuery_category {
  __typename: "CategoryOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  restaurants: CategoryQuery_category_restaurants[] | null;
  category: CategoryQuery_category_category | null;
}

export interface CategoryQuery {
  category: CategoryQuery_category;
}

export interface CategoryQueryVariables {
  input: CategoryInput;
}
