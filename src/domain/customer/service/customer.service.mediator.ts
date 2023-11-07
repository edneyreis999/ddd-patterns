import { v4 as uuid } from 'uuid';
import { CustomerRepository } from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import { TransactionInterface } from "../../@shared/domain/transaction.interface";
import { Mediator } from "../../@shared/service/mediator";
import { Customer } from "../entity/customer";


export class CustomerService{

    constructor(
        private customerRepo: CustomerRepository, 
        private mediator: Mediator,
        private transaction: TransactionInterface
        ){}

    async create(name: string){
        const customer = new Customer(uuid(), name);
        this.mediator.eventEmitter
        await this.mediator.publish(customer); 
        return customer;
    }
}
