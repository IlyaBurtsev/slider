/* eslint-disable no-unused-vars */
import HandlerState from './HandlerState';
import ValuesState from './ValuesState';

type RootState = {
  handlerStates: Array<HandlerState>;
  valuesState: ValuesState;
};

export default RootState;
