interface HandlerOptions {
  id: number
  actions: Actions
  viewConnector: ViewConnector
  orientation: number
  trigger: Function
  customEvents: DataObject<string>

  numberOfHandlers: number
  sliderLength: number
  position?: number
}
