/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: UserCharacterState
// ====================================================

export interface UserCharacterState_userCharacterState {
  __typename: "UserCharacterStateNotification";
  hp: number;
}

export interface UserCharacterState {
  userCharacterState: UserCharacterState_userCharacterState;
}

export interface UserCharacterStateVariables {
  userCharacterId: number;
}
