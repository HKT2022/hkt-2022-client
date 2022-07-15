/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTodoGroupRankings
// ====================================================

export interface GetTodoGroupRankings_todoGroupRankings_character {
  __typename: "UserCharacter";
  id: number;
  hp: number;
}

export interface GetTodoGroupRankings_todoGroupRankings {
  __typename: "User";
  id: string;
  username: string;
  score: number;
  character: GetTodoGroupRankings_todoGroupRankings_character;
}

export interface GetTodoGroupRankings {
  todoGroupRankings: GetTodoGroupRankings_todoGroupRankings[];
}

export interface GetTodoGroupRankingsVariables {
  todoGroupId: number;
  skip: number;
  limit: number;
}
