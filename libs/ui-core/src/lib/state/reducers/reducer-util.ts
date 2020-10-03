import { BaseState, BaseSlice } from './reducer-model';

export function generateNewState(
  currentState: BaseState,
  newItem: BaseSlice,
  key: number
): BaseState {
  const newState: BaseState = { data: currentState.data.slice(0) };
  newState.data[key] = newItem;
  return newState;
}
