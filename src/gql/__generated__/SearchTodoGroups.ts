/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchTodoGroups
// ====================================================

export interface SearchTodoGroups_searchTodoGroups_owner {
  __typename: "User";
  id: string;
  username: string;
}

export interface SearchTodoGroups_searchTodoGroups {
  __typename: "TodoGroup";
  id: number;
  name: string;
  description: string;
  owner: SearchTodoGroups_searchTodoGroups_owner;
}

export interface SearchTodoGroups {
  searchTodoGroups: SearchTodoGroups_searchTodoGroups[];
}

export interface SearchTodoGroupsVariables {
  text: string;
  limit: number;
}
