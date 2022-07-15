/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserCharacter
// ====================================================

export interface GetUserCharacter_User_character {
  __typename: "UserCharacter";
  id: number;
  hp: number;
}

export interface GetUserCharacter_User {
  __typename: "User";
  character: GetUserCharacter_User_character;
}

export interface GetUserCharacter {
  User: GetUserCharacter_User;
}

export interface GetUserCharacterVariables {
  id: string;
}
