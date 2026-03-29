import Joi from "joi";
import { MediaType } from "../enums/enums.js";

const urlSchema = Joi.string()
  .uri({ scheme: ["http", "https"] })
  .trim()
  .max(500)
  .messages({
    "string.uri": "Must be a valid URL (http or https)",
    "string.max": "URL is too long (max 500 characters)",
  });

const urlOrPathSchema = Joi.string()
  .trim()
  .max(500)
  .custom((value, helpers) => {
    const isFullUrl = /^https?:\/\/.+/.test(value);
    const isRelativePath = /^\/[^\s]*$/.test(value);

    if (!isFullUrl && !isRelativePath) {
      return helpers.error("string.uri");
    }

    return value;
  })
  .messages({
    "string.uri": "Must be a valid URL or relative path",
    "string.max": "URL is too long (max 500 characters)",
  });

const uuidSchema = Joi.string().uuid().messages({
  "string.guid": "Must be a valid UUID",
});

const emailSchema = Joi.string()
  .trim()
  .email({ tlds: { allow: false } })
  .lowercase()
  .max(255)
  .messages({
    "string.email": "Please enter a valid email address",
    "string.max": "Email is too long",
  });

const phoneSchema = Joi.string()
  .trim()
  .pattern(/^[0-9+\-\s()]{9,18}$/)
  .messages({
    "string.pattern.base":
      "Please enter a valid phone number (9–18 digits, may include +, -, spaces, parentheses)",
  });

export const createHeroSlideSchema = Joi.object({
  ImageUrl: urlSchema.required().messages({
    "string.empty": "Image URL is required",
    "any.required": "Image URL is required",
  }),
  Tag: Joi.string().min(2).max(60).required().messages({
    "string.min": "Tag must be at least 2 characters",
    "string.max": "Tag cannot exceed 60 characters",
    "string.empty": "Tag is required",
    "any.required": "Tag is required",
  }),
  Title: Joi.string().min(5).max(120).required().messages({
    "string.min": "Title must be at least 5 characters",
    "string.max": "Title cannot exceed 120 characters",
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),
  TitleAccent: Joi.string().max(80).allow("").default("").messages({
    "string.max": "Title accent cannot exceed 80 characters",
  }),
  Description: Joi.string().min(20).max(400).required().messages({
    "string.min": "Description must be at least 20 characters",
    "string.max": "Description cannot exceed 400 characters",
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  CtaLabel: Joi.string().min(2).max(50).required().messages({
    "string.min": "CTA label must be at least 2 characters",
    "string.max": "CTA label cannot exceed 50 characters",
    "string.empty": "CTA label is required",
    "any.required": "CTA label is required",
  }),
  CtaLink: urlOrPathSchema.required().messages({
    "any.required": "CTA link is required",
    "string.empty": "CTA link is required",
  }),
  SortOrder: Joi.number().integer().min(0).max(9999).required().messages({
    "number.base": "Sort order must be a number",
    "number.integer": "Sort order must be an integer",
    "number.min": "Sort order cannot be negative",
    "number.max": "Sort order is too large",
    "any.required": "Sort order is required",
  }),
  IsActive: Joi.boolean().required().messages({
    "boolean.base": "IsActive must be a boolean value",
    "any.required": "IsActive is required",
  }),
});

export const updateHeroSlideSchema = Joi.object({
  ImageUrl: urlSchema,
  Tag: Joi.string().min(2).max(60),
  Title: Joi.string().min(5).max(120),
  TitleAccent: Joi.string().max(80).allow(""),
  Description: Joi.string().min(20).max(400),
  CtaLabel: Joi.string().min(2).max(50),
  CtaLink: urlOrPathSchema,
  SortOrder: Joi.number().integer().min(0).max(9999),
  IsActive: Joi.boolean(),
});

export const CreateProductValidator = Joi.object({
  Name: Joi.string().min(2).max(200).required().messages({
    "string.base": "Product name must be a string",
    "string.empty": "Product name is required",
    "string.min": "Product name must have at least 2 characters",
    "any.required": "Product name is required",
  }),
  Description: Joi.string().min(5).required().messages({
    "string.empty": "Product description is required",
    "string.min": "Product description must be at least 5 characters",
  }),
  Price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than zero",
    "any.required": "Price is required",
  }),
  OfferPrice: Joi.number().positive().optional().allow(null),
  OnOffer: Joi.boolean().optional(),
  Quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity cannot be negative",
    "any.required": "Quantity is required",
  }),
  CategoryId: uuidSchema.required().messages({
    "any.required": "CategoryId is required",
  }),
  IsFeatured: Joi.boolean().optional(),
  IsAvailable: Joi.boolean().optional(),
  ImageUrls: Joi.array().items(urlSchema).min(1).required().messages({
    "array.base": "ImageUrls must be an array",
    "array.min": "At least one product image is required",
  }),
});

export const UpdateProductValidator = Joi.object({
  Name: Joi.string().min(2).max(200),
  Description: Joi.string().min(5),
  Price: Joi.number().positive(),
  OfferPrice: Joi.number().positive().allow(0).allow(null),
  OnOffer: Joi.boolean(),
  Quantity: Joi.number().integer().min(0),
  CategoryId: uuidSchema,
  IsFeatured: Joi.boolean(),
  IsAvailable: Joi.boolean(),
});

export const CreateCategoryValidator = Joi.object({
  Name: Joi.string().min(2).required().messages({
    "string.empty": "Category name is required",
  }),
  ImageUrl: urlSchema.optional(),
});

export const UpdateCategoryValidator = Joi.object({
  Name: Joi.string().min(2),
  ImageUrl: urlSchema,
});

export const CreateProductImageValidator = Joi.object({
  ProductId: uuidSchema.required(),
  ImageUrl: urlSchema.required().messages({
    "any.required": "ImageUrl is required",
  }),
});

export const UpdateProductImageValidator = Joi.object({
  ImageUrl: urlSchema,
});

export const CreateServiceValidator = Joi.object({
  Title: Joi.string().min(3).required().messages({
    "string.empty": "Service title is required",
  }),
  Description: Joi.string().min(10).required().messages({
    "string.empty": "Service description is required",
  }),
  ImageUrl: urlSchema.required(),
  OnOffer: Joi.boolean().optional(),
  IsFeatured: Joi.boolean().optional(),
});

export const UpdateServiceValidator = Joi.object({
  Title: Joi.string().min(3),
  Description: Joi.string().min(10),
  ImageUrl: urlSchema,
  OnOffer: Joi.boolean(),
  IsFeatured: Joi.boolean(),
});

export const CreateServiceRequestValidator = Joi.object({
  ServiceId: uuidSchema.required(),
  PreferredDate: Joi.date().required().messages({
    "any.required": "Preferred date is required",
  }),
  LocationDescription: Joi.string().max(500).required().messages({
    "any.required": "Location description is required",
  }),
});

export const UpdateServiceRequestValidator = Joi.object({
  PreferredDate: Joi.date(),
  LocationDescription: Joi.string().max(500),
});

export const CreateUserValidator = Joi.object({
  FirstName: Joi.string().min(2).required(),
  SecondName: Joi.string().min(2).required(),
  Email: emailSchema.required().messages({
    "any.required": "Email is required",
  }),
  Phone: phoneSchema.required().messages({
    "any.required": "Phone number is required",
  }),
  County: Joi.string().required(),
  LocationDescription: Joi.string().max(500),
  Password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
  }),
});

export const UpdateUserValidator = Joi.object({
  FirstName: Joi.string()
    .min(2)
    .messages({
      "string.base": "First name must be a text value.",
      "string.empty": "First name cannot be empty.",
      "string.min": "First name must have at least 2 characters.",
    }),
  SecondName: Joi.string()
    .min(2)
    .messages({
      "string.base": "Second name must be a text value.",
      "string.empty": "Second name cannot be empty.",
      "string.min": "Second name must have at least 2 characters.",
    }),
  County: Joi.string().messages({
    "string.base": "County must be a text value.",
    "string.empty": "County cannot be empty.",
  }),
  LocationDescription: Joi.string()
    .max(500)
    .messages({
      "string.base": "Location description must be a text value.",
      "string.max": "Location description cannot exceed 500 characters.",
    }),
});


export const CreateCartItemValidator = Joi.object({
  ProductId: uuidSchema.required(),
  Quantity: Joi.number().integer().min(1).required().messages({
    "number.min": "Quantity must be at least 1",
  }),
});

export const UpdateCartItemValidator = Joi.object({
  Quantity: Joi.number().integer().min(1).required(),
});

export const CreateOrderValidator = Joi.object({
  CartId: uuidSchema.required(),
});

export const CreatePaymentValidator = Joi.object({
  OrderId: uuidSchema.required(),
});

export const CreateReviewValidator = Joi.object({
  ProductId: uuidSchema.required(),
  OrderId: uuidSchema.required(),
  Rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.min": "Rating must be between 1 and 5",
    "number.max": "Rating must be between 1 and 5",
  }),
  Message: Joi.string().max(1000),
});

export const UpdateReviewValidator = Joi.object({
  Rating: Joi.number().integer().min(1).max(5),
  Message: Joi.string().max(1000),
});

export const CreateAdvertValidator = Joi.object({
  MediaUrl: urlSchema.required(),
  MediaType: Joi.string()
    .valid(MediaType.Image, MediaType.Video)
    .required()
    .messages({
      "any.only": "MediaType must be Image or Video",
    }),
  Title: Joi.string().max(200).required(),
});

export const UpdateAdvertValidator = Joi.object({
  MediaUrl: urlSchema,
  MediaType: Joi.string().valid(MediaType.Image, MediaType.Video),
  Title: Joi.string().max(200),
  IsActive: Joi.boolean(),
});

export const CreateJobValidator = Joi.object({
  Title: Joi.string().min(3).required(),
  Description: Joi.string().min(20).required(),
  Location: Joi.string().required(),
  SalaryRange: Joi.string(),
  EmploymentType: Joi.string().optional(),
});

export const UpdateJobValidator = Joi.object({
  Title: Joi.string().min(3),
  Description: Joi.string().min(20),
  Location: Joi.string(),
  SalaryRange: Joi.string(),
  IsActive: Joi.boolean(),
});

export const CreateJobApplicationValidator = Joi.object({
  JobId: uuidSchema.required(),
  FullName: Joi.string().min(3).required(),
  Email: emailSchema.required(),
  Phone: phoneSchema.required(),
  ResumeUrl: urlSchema,
  CoverLetter: Joi.string().max(2000),
});

export const loginSchema = Joi.object({
  Email: emailSchema.required(),
  Password: Joi.string().required().messages({
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
});

export const resetPasswordSchema = Joi.object({
  Email: emailSchema.required(),
  ResetCode: Joi.number()
    .integer()
    .min(100000)
    .max(999999)
    .required()
    .messages({
      "number.base": "Reset code must be a number",
      "number.integer": "Reset code must be an integer",
      "number.min": "Reset code must be at least 100000",
      "number.max": "Reset code must be at most 999999",
    }),
  NewPassword: Joi.string().min(6).required().messages({
    "string.min": "New password must be at least 6 characters long",
  }),
});

export const changePasswordSchema = Joi.object({
  OldPassword: Joi.string().required().messages({
    "string.empty": "Old password cannot be empty",
  }),
  NewPassword: Joi.string().min(6).required().messages({
    "string.min": "New password must be at least 6 characters long",
  }),
});

export const contactFormSchema = Joi.object({
  Name: Joi.string().min(2).max(100).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),

  Email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  Phone: Joi.string()
    .pattern(/^[0-9+\-\s()]{9,18}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid phone number format",
      "string.empty": "Phone number is required",
      "any.required": "Phone number is required",
    }),

  Subject: Joi.string().min(3).max(150).required().messages({
    "string.min": "Subject must be at least 3 characters",
    "string.max": "Subject cannot exceed 150 characters",
    "string.empty": "Subject is required",
    "any.required": "Subject is required",
  }),

  Message: Joi.string().min(10).max(2000).required().messages({
    "string.min": "Message must be at least 10 characters",
    "string.max": "Message is too long (max 2000 characters)",
    "string.empty": "Message is required",
    "any.required": "Message is required",
  }),
});