/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TodoInput } from "./../../../codegen/__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateTodo
// ====================================================

export interface CreateTodo_createTodo {
  __typename: "Todo";
  id: number;
  priority: number;
  content: string;
  completed: boolean;
}

export interface CreateTodo {
  createTodo: CreateTodo_createTodo;
}

export interface CreateTodoVariables {
  todo: TodoInput;
}
