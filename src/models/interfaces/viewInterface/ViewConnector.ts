interface ViewConnector extends DataObject<HTMLElement | Scale | undefined> {
  slider: HTMLElement
  startHandlerElement: HTMLElement
	progressBar?: HTMLElement
  endHandlerElement?: HTMLElement
	scaleElements?: Scale
}
