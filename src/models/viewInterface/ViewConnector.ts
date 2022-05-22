interface ViewConnector {
  createSlider(bindElement: HTMLElement): HTMLElement
  getHandlerContainer(container: HTMLElement): HTMLElement

  createHandler(bindElement: HTMLElement, handlerNumber: number): HTMLElement
  getHandlerId(handler: HTMLElement): number
  switchHandlerToActive?(handler: HTMLElement): void
  switchHandlerToDisabled?(handler: HTMLElement): void
}
