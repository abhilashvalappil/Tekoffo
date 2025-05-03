import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be 50 characters or less')
    .refine((val) => val.trim() === val, {
      message: 'Category name cannot have leading or trailing spaces',
    })
    .refine((val) => !/\s{2,}/.test(val), {
      message: 'Category name cannot have consecutive spaces',
    }),
    subcategories: z
    .string()
    .min(1, 'At least one subcategory is required')
    .refine((val) => {
      const subcategories = val
        .split(',')
        .map((sub) => sub.trim())
        .filter((sub) => sub.length > 0);
      return subcategories.length > 0;
    }, {
      message: 'At least one valid subcategory is required',
    })
    .refine((val) => {
      const subcategories = val.split(',').map((sub) => sub.trim());
      return subcategories.every((sub) => sub === sub.trim() && !/\s{2,}/.test(sub));
    }, {
      message: 'Subcategories cannot have leading/trailing spaces or consecutive spaces',
    }),
});
//   subcategories: z
//     .string()
//     .min(1, 'At least one subcategory is required')
//     .transform((val) => val.split(',').map((sub) => sub.trim()).filter((sub) => sub.length > 0))
//     .refine((subcategories) => subcategories.length > 0, {
//       message: 'At least one valid subcategory is required',
//     })
//     .refine(
//       (subcategories) =>
//         subcategories.every((sub) => sub.trim() === sub && !/\s{2,}/.test(sub)),
//       {
//         message: 'Subcategories cannot have leading/trailing spaces or consecutive spaces',
//       }
//     ),
// });

export type CategoryFormData = z.infer<typeof categorySchema>;