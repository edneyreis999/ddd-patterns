import { EventInterface } from "../../@shared/event/event.interface";
import { Customer } from "../entity/customer";

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
