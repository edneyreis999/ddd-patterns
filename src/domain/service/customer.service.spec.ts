import { Customer } from "../entity/customer";
import { Address } from "../entity/value-object/address";
import { CustomerAdressChangeEvent } from "../event/@shared/customer/customer-address.changed.event";
import { CustomerCreatedEvent } from "../event/@shared/customer/customer-created.event";
import { EnviaConsoleAddressChangedHandler } from "../event/@shared/customer/handler/envia.console.address.changed.handler";
import { EnviaConsoleLog1HandlerHandler } from "../event/@shared/customer/handler/envia.console.log1.handler";
import { EnviaConsoleLog2HandlerHandler } from "../event/@shared/customer/handler/envia.console.log2.handler";
import { CustomerService } from "./customer.service";

describe("Customer service unit tests", () => {
    const eventDispatcher = CustomerService.customerEventDispatcher;

    beforeEach(() => {
        eventDispatcher.unregisterAll();
    });

    it('should register an event handler', () => {
        const eventHandler = new EnviaConsoleLog1HandlerHandler();
        eventDispatcher.register(CustomerCreatedEvent.name, eventHandler);


        expect(
            eventDispatcher.getEventHandlers.get(CustomerCreatedEvent.name)
        ).toBeDefined();
        expect(eventDispatcher.getEventHandlers.get(CustomerCreatedEvent.name)?.length).toBe(
            1
        );
        expect(
            eventDispatcher.getEventHandlers.get(CustomerCreatedEvent.name)?.at(0)
        ).toMatchObject(eventHandler);

    });

    it('should be able to register two or more handlers for the same event', () => {
        const eventHandler = new EnviaConsoleLog1HandlerHandler();
        const eventHandler2 = new EnviaConsoleLog2HandlerHandler();
        eventDispatcher.register(CustomerCreatedEvent.name, eventHandler);
        eventDispatcher.register(CustomerCreatedEvent.name, eventHandler2);

        expect(
            eventDispatcher.getEventHandlers.get(CustomerCreatedEvent.name)
        ).toBeDefined();
        expect(eventDispatcher.getEventHandlers.get(CustomerCreatedEvent.name)?.length).toBe(
            2
        );
        expect(
            eventDispatcher.getEventHandlers.get(CustomerCreatedEvent.name)?.at(0)
        ).toMatchObject(eventHandler);
        expect(
            eventDispatcher.getEventHandlers.get(CustomerCreatedEvent.name)?.at(1)
        ).toMatchObject(eventHandler2);
    });

    it('should notify when customer created', () => {
        const eventHandler = new EnviaConsoleLog1HandlerHandler();
        const eventHandler2 = new EnviaConsoleLog2HandlerHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        eventDispatcher.register(CustomerCreatedEvent.name, eventHandler);
        eventDispatcher.register(CustomerCreatedEvent.name, eventHandler2);

        expect(eventDispatcher.getEventHandlers.get(CustomerCreatedEvent.name)?.length).toBe(2);

        new Customer("1", "John Doe");

        expect(spyEventHandler).toHaveBeenCalledWith({
            dataTimeOccurred: expect.any(Date),
            eventData: {
                "id": "1",
                "name": "John Doe",
            }
        });
        expect(spyEventHandler2).toHaveBeenCalledWith({
            dataTimeOccurred: expect.any(Date),
            eventData: {
                "id": "1",
                "name": "John Doe",
            }
        });

    });

    it('should notify when customer address changed', () => {
        const eventHandler = new EnviaConsoleAddressChangedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register(CustomerAdressChangeEvent.name, eventHandler);

        expect(eventDispatcher.getEventHandlers.get(CustomerAdressChangeEvent.name)?.length).toBe(1);

        const customer = new Customer("1", "John Doe");
        const address = new Address({
            city: "São Paulo",
            number: 1,
            street: "Rua Lorem Ipsum",
            zip: "00000-000"
        });

        customer.changeAddress(address);
        customer.activate();
        expect(spyEventHandler).toHaveBeenCalled();
    });
});