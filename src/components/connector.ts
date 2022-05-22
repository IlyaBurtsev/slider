import { createHandler, getHandlerNumber} from '../components/handler/handler'
import { createSlider, getHandlerContainer } from './slider/slider'
const connector: ViewConnector = {
	createSlider: createSlider,
	getHandlerContainer: getHandlerContainer,
	createHandler: createHandler,
	getHandlerNumber: getHandlerNumber

}

export {connector}