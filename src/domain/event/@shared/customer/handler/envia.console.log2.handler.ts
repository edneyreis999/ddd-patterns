import { EventHandlerInterface } from "../../event-handler.interface";
import { CustomerCreatedEvent } from "../customer-created.event";


export class EnviaConsoleLog2HandlerHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log(`Esse é o segundo console.log do evento: CustomerCreated nome do customer é ${event.eventData.name}`, event.eventData);
  }
}
