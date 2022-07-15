/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterTodoGroup
// ====================================================

export interface RegisterTodoGroup_registerTodoGroup_owner {
  __typename: "User";
  id: string;
  username: string;
}

export interface RegisterTodoGroup_registerTodoGroup {
  __typename: "TodoGroup";
  id: number;
  name: string;
  owner: RegisterTodoGroup_registerTodoGroup_owner;
  description: string;
}

export interface RegisterTodoGroup {
  registerTodoGroup: RegisterTodoGroup_registerTodoGroup;
}

export interface RegisterTodoGroupVariables {
  id: number;
}
