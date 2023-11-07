import { Order } from "../../../../domain/checkout/entity/order";
import { OrderItem } from "../../../../domain/checkout/entity/order_item";
import { OrderRepositoryInterface } from "../../../../domain/checkout/repository/order-repository.interface";
import { OrderItemModel } from "../../model/order-item.model";
import { OrderModel } from "../../model/order.model";

export class OrderRepository implements OrderRepositoryInterface {
  async update(entity: Order): Promise<void> {
    const orderModel = await OrderModel.findOne({
      where: { id: entity.id },
      include: ["items"],
    });
    if (!orderModel) {
      throw new Error("Order not found");
    }

    const orderModelAttributes = this.transformOrderEntityToOrderModel(entity);
    await orderModel.update(orderModelAttributes);

    // Delete all order items
    await OrderItemModel.destroy({
      where: {
        order_id: orderModel.id,
      },
    });

    // Insert each order item individually
    for (const item of orderModelAttributes.items) {
      await OrderItemModel.create({ ...item });
    }
  }

  async find(id: string): Promise<Order | null> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: ["items"],
    });
    if (orderModel) {
      const orderItem: OrderItem[] = orderModel.items.map((orderItemModel: OrderItemModel): OrderItem => {
        const orderItemAttributes = this.transformOrderItemModelToOrderItemEntity(orderItemModel);
        return new OrderItem(
          orderItemAttributes.id,
          orderItemAttributes.name,
          orderItemAttributes.price,
          orderItemAttributes.productId,
          orderItemAttributes.quantity);
      }) as OrderItem[];
      return new Order(orderModel.id, orderModel.customer_id, orderItem);
    }

    return null;
  }

  async findAll(): Promise<Order[]> {
    const ordersModel = await OrderModel.findAll({
      include: ["items"],
    });

    return ordersModel.map((orderModel: OrderModel) => {
      const orderItem: OrderItem[] = orderModel.items.map((orderItemModel: OrderItemModel): OrderItem => {
        const orderItemAttributes = this.transformOrderItemModelToOrderItemEntity(orderItemModel);
        return new OrderItem(
          orderItemAttributes.id,
          orderItemAttributes.name,
          orderItemAttributes.price,
          orderItemAttributes.productId,
          orderItemAttributes.quantity);
      }) as OrderItem[];

      return new Order(orderModel.id, orderModel.customer_id, orderItem);
    }) as Order[];
  }

  async create(entity: Order): Promise<void> {
    const orderModelAttributes = this.transformOrderEntityToOrderModel(entity);
    await OrderModel.create(orderModelAttributes,
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  private transformOrderItemModelToOrderItemEntity = (orderItemModel: OrderItemModel): {
    id: string;
    name: string;
    price: number;
    productId: string;
    quantity: number;
  } => {
    return {
      id: orderItemModel.id,
      name: orderItemModel.name,
      price: orderItemModel.price,
      productId: orderItemModel.product_id,
      quantity: orderItemModel.quantity,
    };
  }

  private transformOrderEntityToOrderModel = (order: Order): {
    id: string;
    customer_id: string;
    total: number;
    items: {
      id: string;
      name: string;
      price: number;
      product_id: string;
      quantity: number;
    }[];
  } => {
    return {
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: order.id,
      })),
    };
  }
}
