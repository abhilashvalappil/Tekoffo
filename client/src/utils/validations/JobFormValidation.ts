
// import { z } from 'zod';

// export const JobFormSchema = z.object({
//     title: z.string().trim().min(5, 'Job title must be at least 5 characters').max(100, 'Job title cannot exceed 100 characters'),
//     category: z.string().min(1, 'Please select a category'),
//     subCategory: z.string().min(1, 'Please select a sub-category'),
//     requirements: z
//       .array(z.string().trim().min(8, 'Requirement cannot be empty and must be at least 8 characters').max(100, 'Requirement cannot exceed 100 characters'))
//       .min(1, 'At least one requirement is required'),
//     description: z.string().trim().min(20, 'Description must be at least 20 characters').max(2000, 'Description cannot exceed 2000 characters'),
//     budget: z.number().min(1, 'Budget must be at least $1').max(1000000, 'Budget cannot exceed $1,000,000'),
//     duration: z
//     .string()
//     .trim()
//     .min(4, 'Duration must be at least 4 characters (e.g., "4 days", "two weeks")'),
//   });
  
//   export type JobFormData = z.infer<typeof JobFormSchema>;

import { z } from 'zod';

const noLeadingTrailingSpaces = (val: string) => val === val.trim();
const noConsecutiveSpaces = (val: string) => !val.includes('  ');

export const JobFormSchema = z.object({
  title: z
    .string()
    .min(5, 'Job title must be at least 5 characters')
    .max(100, 'Job title cannot exceed 100 characters')
    .refine(noLeadingTrailingSpaces, {
      message: 'Title must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Title must not contain consecutive spaces',
    }),

  category: z
    .string()
    .min(1, 'Please select a category'),

  subCategory: z
    .string()
    .min(1, 'Please select a sub-category'),

  requirements: z
    .array(
      z
        .string()
        .min(8, 'Requirement must be at least 8 characters')
        .max(100, 'Requirement cannot exceed 100 characters')
        .refine(noLeadingTrailingSpaces, {
          message: 'Requirement must not have leading or trailing spaces',
        })
        .refine(noConsecutiveSpaces, {
          message: 'Requirement must not contain consecutive spaces',
        })
    )
    .min(1, 'At least one requirement is required'),

  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description cannot exceed 2000 characters')
    .refine(noLeadingTrailingSpaces, {
      message: 'Description must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Description must not contain consecutive spaces',
    }),

  budget: z
    .number()
    .min(1, 'Budget must be at least $1')
    .max(1000000, 'Budget cannot exceed $1,000,000'),

  duration: z
    .string()
    .min(4, 'Duration must be at least 4 characters (e.g., "4 days", "two weeks")')
    .refine(noLeadingTrailingSpaces, {
      message: 'Duration must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Duration must not contain consecutive spaces',
    }),
});

export type JobFormData = z.infer<typeof JobFormSchema>;


   