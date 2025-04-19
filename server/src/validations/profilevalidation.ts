import { z } from 'zod';

const noLeadingTrailingSpaces = (val: string) => val === val.trim();
const noConsecutiveSpaces = (val: string) => !val.includes('  ');

export const profileSchema = z.object({
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
    .max(1000, 'Description must not exceed 1000 characters')
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
});


//** freelancer profile validation
export const freelancerProfileSchema = z.object({
    fullName: z.string()
      .min(3, 'Full name must be at least 3 characters')
      .max(100, 'Full name must be 100 characters or less')
      .refine(noLeadingTrailingSpaces, { message: 'Full name must not have leading or trailing spaces' })
      .refine(noConsecutiveSpaces, { message: 'Full name must not contain consecutive spaces' }),
  
    description: z.string()
      .min(10, 'Bio must be at least 10 characters')
      .max(500, 'Bio must be 500 characters or less')
      .refine(noLeadingTrailingSpaces, { message: 'Description must not have leading or trailing spaces' })
      .refine(noConsecutiveSpaces, { message: 'Description must not contain consecutive spaces' }),
  
    country: z.string()
      .min(3, 'Country is required')
      .max(100, 'Country must be 100 characters or less')
      .refine(noLeadingTrailingSpaces, { message: 'Country must not have leading or trailing spaces' })
      .refine(noConsecutiveSpaces, { message: 'Country must not contain consecutive spaces' }),
  
    skills: z.array(z.string().min(1)).nonempty('At least one skill is required'),
  
    preferredJobFields: z.array(z.string().min(1)).nonempty('At least one preferred job field is required'),
  
    linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  
    githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  
    portfolioUrl: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  
    profilePicture: z.any().optional()
  });