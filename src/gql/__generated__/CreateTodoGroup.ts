/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TodoGroupInput } from "./../../../codegen/__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateTodoGroup
// ====================================================

export interface CreateTodoGroup_createTodoGroup_owner {
  __typename: "User";
  id: string;
  username: string;
}

export interface CreateTodoGroup_createTodoGroup {
  __typename: "TodoGroup";
  id: number;
  name: string;
  owner: CreateTodoGroup_createTodoGroup_owner;
  description: string;
}

export interface CreateTodoGroup {
  createTodoGroup: CreateTodoGroup_createTodoGroup;
}

export interface CreateTodoGroupVariables {
  todoGroup: TodoGroupInput;
}
