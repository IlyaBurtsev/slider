interface HandlerOptions {
  id: number
  actions: Actions
  viewConnector: ViewConnector
  orientation: number
  trigger: Function
  eventsForTrigger: DataObject<string>

	numberOfHandlers: number
}
