class GameEvents {
  constructor(gameController) {
    this.pendingEvents = [];
    this.pastEvents = [];
    this.listeners = [];
    this.addListener(gameController);
  }
  addListener(listener) {
    this.listeners.push(listener);
  }
  generateEvent(event) {
    this.pendingEvents.push(event);
  }
  executePendingEvents() {
    this.pendingEvents.forEach(event => {
      this.listeners.forEach(listener => {
        listener.eventCallback(event);
      });
    });
  }
}
