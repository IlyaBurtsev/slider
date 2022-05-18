import { Observer } from "../../../observer/Observer";

class Slider extends Observer {
	private sliderContainer: HTMLElement;
	constructor (bindElement: HTMLElement, options: object){
		super();
		this.sliderContainer = bindElement;
	}
	private init(): void {

	}
}