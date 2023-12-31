import { EventDispatcher } from "../../@shared/event/event-dispatcher";
import { Customer } from "../entity/customer";
import { CustomerAdressChangeEvent } from "../event/customer-address.changed.event";
import { CustomerCreatedEvent } from "../event/customer-created.event";



export class CustomerService {
    private static _customerEventDispatcher: EventDispatcher = new EventDispatcher();


    static notifyCustomerCreatedEvent({ customerId, customerName }: { customerId: string, customerName: string }) {
        const customerCreatedEvent = new CustomerCreatedEvent({
            id: customerId,
            name: customerName
        });


        this.customerEventDispatcher.notify(customerCreatedEvent);
    }

    static notifyAddressChangedEvent({ customer }: { customer: Customer }) {

        const customerAddressChangedEvent = new CustomerAdressChangeEvent({ customer });
        this.customerEventDispatcher.notify(customerAddressChangedEvent);
    }

    public static get customerEventDispatcher(): EventDispatcher {
        return CustomerService._customerEventDispatcher;
    }
}
