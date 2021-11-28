import { Request, Response, NextFunction } from 'express';
import { Product } from '../../models/Product';
import {
  stringValidationError,
  optionalStringValidationError,
  numberTypeError,
  requiredDataError,
  optionalNumberTypeError,
  getOptionalString
} from '../../../utilities/validations';

export function checkCreation(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.body = getProductData(req.body);
  const { name, price, category_id } = req.body;
  const error =
    requiredDataError<Product>(req.body) ||
    stringValidationError(name, 'name', 3) ||
    priceError(price) ||
    numberTypeError(category_id, 'category_id');

  error ? res.status(400).json({ error }) : next();
}

export function checkUpdate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.body = getProductData(req.body);
  const { name, price, category_id } = req.body;
  const error =
    requiredDataError<Product>(req.body) ||
    optionalStringValidationError(name, 'name', 3) ||
    optionalPriceError(price) ||
    optionalNumberTypeError(category_id, 'category_id');
  error ? res.status(400).json({ error }) : next();
}

function getProductData(params: Omit<Product, 'id'>): Partial<Product> {
  const { name, price, category_id, description } = params;
  const product: Partial<Product> = {
    name: name ? name.toString().trim() : undefined,
    category_id: category_id ? category_id : undefined,
    price: price ? price.toString().trim() : undefined,
    description: getOptionalString(description)
  };
  return JSON.parse(JSON.stringify(product));
}

function priceError(price: string): string | undefined {
  const priceValue: number = parseFloat(price);
  if (!priceValue) {
    return "PRICE_REQUIRED";
  }
  return priceValue < 0 ? "PRICE_MUST_BE_POSITIVE" : undefined;
}

function optionalPriceError(price: string): string | undefined {
  return !price ? undefined : priceError(price);
}
