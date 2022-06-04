interface ViewConnector extends DataObject<HTMLElement | undefined> {
  slider: HTMLElement
  startHandlerElement: HTMLElement
	progressBar: HTMLElement
  endHandlerElement?: HTMLElement
}
