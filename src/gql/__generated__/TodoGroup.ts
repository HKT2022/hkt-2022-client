/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TodoGroup
// ====================================================

export interface TodoGroup_TodoGroup_owner {
  __typename: "User";
  id: string;
  username: string;
}

export interface TodoGroup_TodoGroup {
  __typename: "TodoGroup";
  id: number;
  name: string;
  owner: TodoGroup_TodoGroup_owner;
  description: string;
}

export interface TodoGroup {
  TodoGroup: TodoGroup_TodoGroup;
}

export interface TodoGroupVariables {
  id: number;
}
