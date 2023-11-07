import { EventInterface } from "../../@shared/event/event.interface";

export interface CustomerCreatedEventData {
  id: string;
  name?: string;
}

export class CustomerCreatedEvent implements EventInterface {
  static name = "CustomerCreatedEvent";

  dataTimeOccurred: Date;
  eventData: CustomerCreatedEventData;

  constructor(eventData: CustomerCreatedEventData) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
