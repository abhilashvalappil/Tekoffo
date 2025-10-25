import { z } from 'zod';

const noLeadingTrailingSpaces = (val: string) => val === val.trim();
const noConsecutiveSpaces = (val: string) => !val.includes('  ');

export const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .refine(noLeadingTrailingSpaces, {
      message: 'Full name must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Full name must not contain consecutive spaces',
    }),

  companyName: z
    .string()
    .max(100, 'Company name cannot exceed 100 characters')
    .optional(),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters')
    .refine(noLeadingTrailingSpaces, {
      message: 'Description must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Description must not contain consecutive spaces',
    }),

  country: z
    .string()
    .min(3, 'Country must be at least 3 characters')
    .refine(noLeadingTrailingSpaces, {
      message: 'Country must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Country must not contain consecutive spaces',
    }),

  // profilePicture: z.instanceof(File).optional().nullable(),
  profilePicture: z.union([z.instanceof(File), z.string()]).optional().nullable(),

});

export type ProfileFormData = z.infer<typeof profileFormSchema>;





//** freelancer profile validation

export const freelancerProfileSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name is required and must be at least 3 characters')
    .max(100, 'Full name must be 100 characters or less')
    .refine(noLeadingTrailingSpaces, {
      message: 'Full name must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Full name must not contain consecutive spaces',
    }),

  description: z
    .string()
    .min(10, 'Bio is required and must be at least 10 characters')
    .max(500, 'Bio must be 500 characters or less')
    .refine(noLeadingTrailingSpaces, {
      message: 'Bio must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Bio must not contain consecutive spaces',
    }),

  country: z
    .string()
    .min(3, 'Country is required')
    .max(100, 'Country must be 100 characters or less')
    .refine(noLeadingTrailingSpaces, {
      message: 'Country must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Country must not contain consecutive spaces',
    }),

  skills: z
    .string()
    .min(3, 'Skills are required and must be at least 3 characters')
    .max(200, 'Skills must be 200 characters or less')
    .refine(noLeadingTrailingSpaces, {
      message: 'Skills must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Skills must not contain consecutive spaces',
    }),

  preferredJobFields: z
    .string()
    .min(3, 'Preferred job fields are required and must be at least 3 characters')
    .max(200, 'Preferred job fields must be 200 characters or less')
    .refine(noLeadingTrailingSpaces, {
      message: 'Preferred job fields must not have leading or trailing spaces',
    })
    .refine(noConsecutiveSpaces, {
      message: 'Preferred job fields must not contain consecutive spaces',
    }),

  linkedinUrl: z
    .string()
    .url('Invalid LinkedIn URL')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val ? val.trim() : '')),

  githubUrl: z
    .string()
    .url('Invalid GitHub URL')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val ? val.trim() : '')),

  portfolioUrl: z
    .string()
    .url('Invalid portfolio URL')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val ? val.trim() : '')),

  profilePicture: z
    .instanceof(File, { message: 'Profile picture must be a valid file' })
    .optional()
    .nullable()
    .refine(
      (file) => {
        if (!file) return true;
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        return validTypes.includes(file.type);
      },
      { message: 'Profile picture must be a JPEG, JPG, or PNG file' }
    )
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= 5 * 1024 * 1024; // 5MB
      },
      { message: 'Profile picture must be less than 5MB' }
    ),
});

export type FreelancerProfileFormData = z.infer<typeof freelancerProfileSchema>;