import { EventDispatcherInterface } from "./event-dispatcher.interface";
import { EventHandlerInterface } from "./event-handler.interface";
import { EventInterface } from "./event.interface";


export class EventDispatcher implements EventDispatcherInterface {
  private eventHandlers = new Map<string, EventHandlerInterface[]>();

  get getEventHandlers(): Map<string, EventHandlerInterface[]> {
    return this.eventHandlers;
  }

  register(eventName: string, eventHandler: EventHandlerInterface): void {
    if (this.eventHandlers.has(eventName)) {
      // If the eventName already exists, add the new eventHandler to the existing array
      this.eventHandlers.get(eventName)!.push(eventHandler);
    } else {
      // If the eventName does not exist, create a new array with the eventHandler
      this.eventHandlers.set(eventName, [eventHandler]);
    }
  }

  unregister(eventName: string, eventHandler: EventHandlerInterface): void {
    const eventIndex = this.eventHandlers.get(eventName)?.indexOf(eventHandler)
    if (eventIndex !== undefined && eventIndex !== -1) {
      this.eventHandlers.get(eventName)?.splice(eventIndex, 1)
    }
  }

  unregisterAll(): void {
    this.eventHandlers.clear()
  }

  notify(event: EventInterface): void {
    const eventName = event.constructor.name;
    this.eventHandlers.get(eventName)?.forEach((eventHandler) => {
      eventHandler.handle(event);
    });
  }
}
