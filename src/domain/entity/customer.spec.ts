import { Customer } from "./customer";
import { Address } from "./value-object/address";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      new Customer("", "John");
    }).toThrow("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      new Customer("123", "");
    }).toThrow("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("123", "John");

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address({
      city: 'Anytown',
      number: 123,
      street: '123 Main St',
      zip: '12345',
    });
    customer.changeAddress(address);

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1");
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

  it("should change address", () => {
    // Arrange
    const customer = new Customer("123", "John");
    const newAddress = new Address({
      city: 'Anytown',
      number: 123,
      street: '123 Main St',
      zip: '12345',
    });
  
    // Act
    customer.changeAddress(newAddress);
  
    // Assert
    expect(customer.address).toEqual(newAddress);
  });

  it('should accept values in the constructor', () => {
    const address = new Address({
      city: 'Anytown',
      number: 123,
      street: '123 Main St',
      zip: '12345',
    });
    expect(address.street).toEqual('123 Main St');
    expect(address.city).toEqual('Anytown');
    expect(address.number).toEqual(123);
    expect(address.zip).toEqual("12345");
  });

  describe('Address', () => {
  
    it('should throw error when number is 0', () => {
      expect(() => {
        new Address({
          city: 'Anytown',
          number: 0,
          street: '123 Main St',
          zip: '12345',
        });
      }).toThrow("Number is required");
    });
  });
});
