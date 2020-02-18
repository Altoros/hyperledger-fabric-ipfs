// @flow
import type {User} from './User';
import type {Config} from './Config';

export type Action = {
  +type: string,
  +message?: string | Array<string>
};
export type ErrorAction = Action & {error: string};

export type State = mixed;
export type GetState = () => State;
export type PromiseAction = Promise<Action>;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

/////////////////////////////////////////
//              BL Actions             //
/////////////////////////////////////////

export type UserAction = Action & {user: User};
export type ConfigAction = Action & {config: Config};
