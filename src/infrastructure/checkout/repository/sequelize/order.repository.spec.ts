import { Sequelize } from "sequelize-typescript";
import { Order } from "../../../../domain/checkout/entity/order";
import { OrderItem } from "../../../../domain/checkout/entity/order_item";
import { Customer } from "../../../../domain/customer/entity/customer";
import { Address } from "../../../../domain/customer/entity/value-object/address";
import { Product } from "../../../../domain/product/entity/product";
import { CustomerModel } from "../../../customer/model/customer.model";
import { CustomerRepository } from "../../../customer/repository/sequelize/customer.repository";
import { ProductModel } from "../../../product/model/product.model";
import { ProductRepository } from "../../../product/repository/sequelize/product.repository";
import { OrderItemModel } from "../../model/order-item.model";
import { OrderModel } from "../../model/order.model";
import { OrderRepository } from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  const createCustomer = async (customerParam?: Partial<Customer>, addresParam?: Partial<Address>): Promise<Customer> => {
    const customerRepository = new CustomerRepository();
    const customerAttributes = {
      id: "123",
      name: "Customer 1",
      ...customerParam
    }
    const customer = new Customer(customerAttributes.id, customerAttributes.name);
    const address = new Address({
      street: "Street 1",
      number: 1,
      zip: "Zipcode 1",
      city: "City 1",
      ...addresParam
    });
    customer.changeAddress(address);
    await customerRepository.create(customer);

    return customer;
  }

  const createProduct = async (productParam?: Partial<Product>): Promise<Product> => {
    const productRepository = new ProductRepository();
    const productAttributes = {
      id: "123",
      name: "product 1",
      price: 10,
      ...productParam
    }
    const product = new Product(productAttributes.id, productAttributes.name, productAttributes.price);
    await productRepository.create(product);

    return product;
  }

  const createOrderItem = (orderItemParam?: Partial<OrderItem>): OrderItem => {
    const orderItemAttributes = {
      id: "1",
      name: "product 1",
      price: 10,
      productId: "123",
      quantity: 2,
      ...orderItemParam
    }
    const orderItem = new OrderItem(
      orderItemAttributes.id,
      orderItemAttributes.name,
      orderItemAttributes.price,
      orderItemAttributes.productId,
      orderItemAttributes.quantity
    );
    return orderItem;
  }

  const createOrder = async (orderParam?: Partial<Order>): Promise<Order> => {
    const orderAttributes = {
      id: "123",
      customerId: "123",
      items: [],
      ...orderParam
    }
    const order = new Order(orderAttributes.id, orderAttributes.customerId, orderAttributes.items);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    return order;
  }

  const createDefaultOrder = async (): Promise<Order> => {
    const customer = await createCustomer();
    const product = await createProduct();
    const orderItem = createOrderItem({ productId: product.id });
    const order = await createOrder({ customerId: customer.id, items: [orderItem] });

    return order;
  }


  it("should create a new order", async () => {
    const customer = await createCustomer();
    const product = await createProduct();
    const orderItem = createOrderItem({ productId: product.id });
    const order = await createOrder({ customerId: customer.id, items: [orderItem] });

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel!.toJSON()).toStrictEqual({
      id: "123",
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find an order", async () => {
    const orderRepository = new OrderRepository();
    const order = await createDefaultOrder();

    const foundOrder = await orderRepository.find(order.id);

    expect(foundOrder).toStrictEqual(order);
  });

  it("should find all orders", async () => {
    const orderRepository = new OrderRepository();
    const customer = await createCustomer({ id: "2", name: "Customer 2" });
    const product = await createProduct({ id: "2", name: "Product 2" });
    const orderItem = createOrderItem({ id: "456", productId: product.id, quantity: 15 });

    const order1 = await createOrder({ id: "456", customerId: customer.id, items: [orderItem] });
    const order2 = await createDefaultOrder();

    const foundOrders = await orderRepository.findAll();

    expect(foundOrders).toStrictEqual([order1, order2]);
  });

  it("should update an order", async () => {
    const orderRepository = new OrderRepository();
    const order = await createDefaultOrder();

    const foundOrder = await orderRepository.find(order.id);

    expect(foundOrder).toStrictEqual(order);

    const product2 = await createProduct({ id: "2", name: "Product 2", });
    const product3 = await createProduct({ id: "3", name: "Product 3", });

    const orderItem1 = createOrderItem({ id: "456", productId: product2.id, quantity: 15 });
    const orderItem2 = createOrderItem({ id: "678", productId: product3.id, quantity: 5 });

    const updatedOrder = new Order(order.id, order.customerId, [orderItem1, orderItem2]);
    await orderRepository.update(updatedOrder);

    const foundUpdatedOrder = await orderRepository.find(order.id);

    expect(foundUpdatedOrder).toStrictEqual(updatedOrder);
  });
});
