// import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import {Plugin} from '../src/plugin/Plugin'
import { getViewConnector } from '../src/components/connector';
import { Handler } from "../src/models/Handler";
import { getElement } from '../src/plugin/utils/utils';



const resultHandlers = [new Handler(0)]

describe('Plugin', () => {
	let slider: Plugin
	beforeEach(() => {
		const sliderContainer = getElement('.slider');
		if(!sliderContainer) {
			return
		}
		slider = new Plugin(getViewConnector(sliderContainer))
		
	});


	test('Should return array of Handler', () => {
		
		const event = new Event('mousemove', {
			
		})
	})
})