import { Request, Response, NextFunction } from 'express';
import { Order } from '../../models/Order';
import { OrderItem } from '../../models/OrderItem';
import {
  numberTypeError,
  requiredDataError,
  requiredTimestampError,
  getOptionalString
} from '../../../utilities/validations';

export function checkCreation(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { item, calledAt, comments } = req.body;
  const created_at = calledAt ? new Date(calledAt) : undefined;
  const orderItem = getOrderItemData(item);

  const error =
    requiredTimestampError(created_at, 'calledAt') ||
    getNewOrderItemError(orderItem, 'ORDER_ITEM_REQUIRED');

  const orderData: Partial<Order> = {
    created_at,
    customer_id: res.locals.userData.id,
    comments: !comments ? null : getOptionalString(comments)
  };
  req.body = { ...orderData, item: orderItem };

  error ? res.status(400).json({ error }) : next();
}

export function checkOrderItemCreation(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.body = getOrderItemData(req.body);
  const error = getNewOrderItemError(req.body);
  error ? res.status(400).json({ error }) : next();
}

export function checkOrderItemUpdate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { product_id, ...updateData } = getOrderItemData(req.body);
  req.body = updateData;

  const error = getUpdatedOrderItemError(req.body);
  error ? res.status(400).json({ error }) : next();
}

export function checkCompletion(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { calledAt, comments } = req.body;
  const completed_at = calledAt ? new Date(calledAt) : undefined;
  req.body = { completed_at, comments };

  const error = requiredTimestampError(completed_at, 'calledAt');
  error ? res.status(400).json({ error }) : next();
}

function getNewOrderItemError(item: Partial<OrderItem>, dataError?: string): string | undefined {
  const { product_id, quantity } = item;
  return (
    requiredDataError<OrderItem>(item, dataError) ||
    numberTypeError(product_id, 'product_id') ||
    quantityError(quantity)
  );
}

function getUpdatedOrderItemError(item: Partial<OrderItem>): string | undefined {
  const { quantity } = item;
  return (
    requiredDataError<OrderItem>(item) ||
    optionalQuantityError(quantity)
  );
}

function getOrderItemData(params: Partial<OrderItem>): Partial<OrderItem> {
  const { product_id, quantity, engraving } = params;
  const orderItem: Partial<OrderItem> = {
    product_id: product_id ? product_id : undefined,
    quantity: typeof quantity === 'number' ? quantity : undefined,
    engraving: getOptionalString(engraving)
  };
  return JSON.parse(JSON.stringify(orderItem));
}

function quantityError(quantity: number | undefined): string | undefined {
  if (!quantity) {
    return `QUANTITY_REQUIRED`;
  }
  return quantity < 0 ? `QUANTITY_MUST_BE_POSITIVE` : undefined;
}

function optionalQuantityError(
  quantity: number | undefined
): string | undefined {
  if (typeof quantity !== 'number') {
    return undefined;
  }
  return quantityError(quantity);
}
