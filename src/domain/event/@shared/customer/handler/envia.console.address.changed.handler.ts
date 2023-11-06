import { EventHandlerInterface } from "../../event-handler.interface";
import { CustomerAdressChangeEvent } from "../customer-address.changed.event";


export class EnviaConsoleAddressChangedHandler
  implements EventHandlerInterface<CustomerAdressChangeEvent>
{
  handle(event: CustomerAdressChangeEvent): void {
    const { id, name, address } = event.eventData.customer;
    console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${address}`, event.eventData);
  }
}
