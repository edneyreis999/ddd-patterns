import { EventInterface } from "../event.interface";

export interface ProductCreatedEventData {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
}

export class ProductCreatedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: ProductCreatedEventData;

  constructor(eventData: ProductCreatedEventData) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
