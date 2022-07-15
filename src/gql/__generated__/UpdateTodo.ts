/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TodoUpdate } from "./../../../codegen/__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTodo
// ====================================================

export interface UpdateTodo_updateTodo {
  __typename: "Todo";
  id: number;
}

export interface UpdateTodo {
  updateTodo: UpdateTodo_updateTodo;
}

export interface UpdateTodoVariables {
  id: number;
  todo: TodoUpdate;
}
