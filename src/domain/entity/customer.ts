import { CustomerService } from "../service/customer.service";
import { Address } from "./value-object/address";

/**
 * Customer class represents a customer in the system.
 */
export class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;

  private _active: boolean = false;
  private _rewardPoints: number = 0;


  /**
 * Customer constructor.
 * @param id - The unique ID of the customer.
 * @param name - The name of the customer.
 */
  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();

    CustomerService.notifyCustomerCreatedEvent({ customerId: id, customerName: name });
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  changeAddress(address: Address) {
    this._address = address;

    CustomerService.notifyAddressChangedEvent({ customer: this });
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  public get id(): string {
    return this._id;
  }

  /**
 * Get the name of the customer.
 * @returns The name of the customer.
 */
  get name(): string {
    return this._name;
  }

  public get address(): Address {
    return this._address;
  }

  public get rewardPoints(): number {
    return this._rewardPoints;
  }

}
