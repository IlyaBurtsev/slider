import { createHandler, getHandlerNumber } from '../components/handler/handler'
import { createSlider, getHandlerContainer } from './slider/slider'
const connector: ViewConnector = {
  createSlider: createSlider,
  getHandlerContainer: getHandlerContainer,
  createHandler: createHandler,
  getHandlerId: getHandlerNumber,
}

export { connector }
