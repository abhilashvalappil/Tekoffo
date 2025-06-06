import { z } from 'zod';

const noLeadingTrailingSpaces = (val: string) => val === val.trim();
const noConsecutiveSpaces = (val: string) => !val.includes('  ');

export const GigFormSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .refine(noLeadingTrailingSpaces, {
      message: 'Title must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Title must not contain consecutive spaces',
    }),

  category: z
    .string()
    .min(1, 'Please select a category'),

  description: z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description cannot exceed 2000 characters')
    .refine(noLeadingTrailingSpaces, {
      message: 'Description must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Description must not contain consecutive spaces',
    }),

  price: z
    .number()
    .min(5, 'Price must be at least $5')
    .max(10000, 'Price cannot exceed $10,000'),

  revisions: z
    .number()
    .min(0, 'Revisions must be 0 or more')
    .max(10, 'Revisions cannot exceed 10'),

  deliveryTime: z
    .string()
    .min(1, 'Delivery time is required')
    .refine(noLeadingTrailingSpaces, {
      message: 'Delivery time must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Delivery time must not contain consecutive spaces',
    }),

  skills: z
    .array(
      z.string().min(1, 'Skill cannot be empty')
    )
    .min(1, 'At least one skill is required'),

  requirements: z
    .array(
      z
        .string()
        .min(3, 'Requirement must be at least 3 characters')
        .max(100, 'Requirement cannot exceed 100 characters')
        .refine(noLeadingTrailingSpaces, {
          message: 'Requirement must not have leading or trailing spaces',
        })
        .refine(noConsecutiveSpaces, {
          message: 'Requirement must not contain consecutive spaces',
        })
    )
    .min(1, 'At least one requirement is required'),
});

export type GigFormData = z.infer<typeof GigFormSchema>;
