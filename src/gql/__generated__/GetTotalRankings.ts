/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTotalRankings
// ====================================================

export interface GetTotalRankings_totalRankings_character {
  __typename: "UserCharacter";
  id: number;
  hp: number;
}

export interface GetTotalRankings_totalRankings {
  __typename: "User";
  id: string;
  username: string;
  score: number;
  character: GetTotalRankings_totalRankings_character;
}

export interface GetTotalRankings {
  totalRankings: GetTotalRankings_totalRankings[];
}

export interface GetTotalRankingsVariables {
  skip: number;
  limit: number;
}
