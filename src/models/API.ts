/* eslint-disable no-unused-vars */
import { UserOptions } from './interfaces';
import { RootState } from './types';

interface API {
  updateSliderOptions: (options: UserOptions) => void;
  moveHandlerTo: (value: number, handlerIndex: number) => void;
  subscribeToChangeState: (handler: (state?: RootState, id?: number, type?: string) => void, subscribe?: boolean) => void;
  subscribeToGetStarted: (handler: (id?: number) => void, subscribe?: boolean) => void;
  subscribeToTheEndOfTheMovement: (handler: (id?: number) => void, subscribe?: boolean) => void;
	onChangeOptions: (handler: (options: UserOptions) => void, subscribe?: boolean) => void;
	getHandlerValue: (id: number) => number;
}

export default API;
