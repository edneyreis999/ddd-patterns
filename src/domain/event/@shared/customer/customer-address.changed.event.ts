import { Customer } from "../../../entity/customer";
import { EventInterface } from "../event.interface";

export interface CustomerAdressChangeEventData {
  customer: Customer;
}

export class CustomerAdressChangeEvent implements EventInterface {
  static name = "CustomerAdressChangeEvent";

  dataTimeOccurred: Date;
  eventData: CustomerAdressChangeEventData;

  constructor(eventData: CustomerAdressChangeEventData) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
