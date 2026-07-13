import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";

import type {
  CreateBusinessOrderBody,
  CreateOrderItemBody,
  CreateOrderPaymentBody,
  UpdateOrderItemBody
} from "./orders.dto";
import { OrdersService } from "./orders.service";

@Controller("pos/:businessSlug/orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createBusinessOrder(
    @Param("businessSlug") businessSlug: string,
    @Body() body: CreateBusinessOrderBody
  ) {
    return this.ordersService.createBusinessOrder(businessSlug, body);
  }

  @Get()
  listBusinessOrders(
    @Param("businessSlug") businessSlug: string,
    @Query("status") status?: string
  ) {
    return this.ordersService.listBusinessOrders(businessSlug, { status });
  }

  @Get(":orderId")
  getBusinessOrder(
    @Param("businessSlug") businessSlug: string,
    @Param("orderId") orderId: string
  ) {
    return this.ordersService.getBusinessOrder(businessSlug, orderId);
  }

  @Patch(":orderId/status")
  updateBusinessOrderStatus(
    @Param("businessSlug") businessSlug: string,
    @Param("orderId") orderId: string,
    @Body("status") status?: string
  ) {
    return this.ordersService.updateBusinessOrderStatus(businessSlug, orderId, status);
  }

  @Patch(":orderId/draft")
  updateBusinessOrderDraft(
    @Param("businessSlug") businessSlug: string,
    @Param("orderId") orderId: string,
    @Body() body: CreateBusinessOrderBody
  ) {
    return this.ordersService.updateBusinessOrderDraft(businessSlug, orderId, body);
  }

  @Patch(":orderId/table")
  updateBusinessOrderTable(
    @Param("businessSlug") businessSlug: string,
    @Param("orderId") orderId: string,
    @Body("tableLabel") tableLabel?: string | null
  ) {
    return this.ordersService.updateBusinessOrderTable(businessSlug, orderId, tableLabel);
  }

  @Post(":orderId/items")
  addBusinessOrderItem(
    @Param("businessSlug") businessSlug: string,
    @Param("orderId") orderId: string,
    @Body() body: CreateOrderItemBody
  ) {
    return this.ordersService.addBusinessOrderItem(businessSlug, orderId, body);
  }

  @Patch(":orderId/items/:orderItemId")
  updateBusinessOrderItem(
    @Param("businessSlug") businessSlug: string,
    @Param("orderId") orderId: string,
    @Param("orderItemId") orderItemId: string,
    @Body() body: UpdateOrderItemBody
  ) {
    return this.ordersService.updateBusinessOrderItem(businessSlug, orderId, orderItemId, body);
  }

  @Post(":orderId/items/:orderItemId/remove")
  removeBusinessOrderItem(
    @Param("businessSlug") businessSlug: string,
    @Param("orderId") orderId: string,
    @Param("orderItemId") orderItemId: string
  ) {
    return this.ordersService.removeBusinessOrderItem(businessSlug, orderId, orderItemId);
  }

  @Post(":orderId/send-to-kitchen")
  sendBusinessOrderToKitchen(
    @Param("businessSlug") businessSlug: string,
    @Param("orderId") orderId: string
  ) {
    return this.ordersService.sendBusinessOrderToKitchen(businessSlug, orderId);
  }

  @Post(":orderId/cancel")
  cancelBusinessOrder(
    @Param("businessSlug") businessSlug: string,
    @Param("orderId") orderId: string
  ) {
    return this.ordersService.cancelBusinessOrder(businessSlug, orderId);
  }

  @Post(":orderId/void")
  voidBusinessOrder(
    @Param("businessSlug") businessSlug: string,
    @Param("orderId") orderId: string
  ) {
    return this.ordersService.voidBusinessOrder(businessSlug, orderId);
  }

  @Post(":orderId/refund")
  refundBusinessOrder(
    @Param("businessSlug") businessSlug: string,
    @Param("orderId") orderId: string
  ) {
    return this.ordersService.refundBusinessOrder(businessSlug, orderId);
  }

  @Post(":orderId/payments")
  createBusinessOrderPayment(
    @Param("businessSlug") businessSlug: string,
    @Param("orderId") orderId: string,
    @Body() body: CreateOrderPaymentBody
  ) {
    return this.ordersService.createBusinessOrderPayment(businessSlug, orderId, body);
  }

  @Get(":orderId/receipt")
  getBusinessOrderReceipt(
    @Param("businessSlug") businessSlug: string,
    @Param("orderId") orderId: string
  ) {
    return this.ordersService.getBusinessOrderReceipt(businessSlug, orderId);
  }
}
