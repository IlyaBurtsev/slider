interface ViewConnector extends DataObject<HTMLElement | undefined> {
  slider: HTMLElement
  startHandlerElement: HTMLElement
  endHandlerElement?: HTMLElement
}
