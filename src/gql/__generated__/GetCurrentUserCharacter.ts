/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentUserCharacter
// ====================================================

export interface GetCurrentUserCharacter_currentUser_character {
  __typename: "UserCharacter";
  id: number;
  hp: number;
}

export interface GetCurrentUserCharacter_currentUser {
  __typename: "User";
  character: GetCurrentUserCharacter_currentUser_character;
}

export interface GetCurrentUserCharacter {
  currentUser: GetCurrentUserCharacter_currentUser;
}
