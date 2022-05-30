import { Orientation } from '../../models/Orientation';

class SliderDomController {
  private length: number;
  private startPosition: number;
  constructor(slider: HTMLElement, orientation: number, callback: Function) {
    const parametrs = new SliderLisrener(slider);
  }

  private getSliderParametrs(slider: HTMLElement, orientation: number): void {
    const rect = slider.getBoundingClientRect();
    
    if (orientation === Orientation.Horizontal) {
			this.length = rect.width;
      this.startPosition = rect.left;
    } else {
			this.length = rect.height
      this.startPosition = rect.top;
    }
  }
}
