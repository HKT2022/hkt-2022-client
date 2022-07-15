/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyTodos
// ====================================================

export interface MyTodos_myTodos {
  __typename: "Todo";
  id: number;
  createdAt: any;
  priority: number;
  completed: boolean;
  content: string;
}

export interface MyTodos {
  myTodos: MyTodos_myTodos[];
}
