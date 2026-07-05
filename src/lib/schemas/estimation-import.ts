import { z } from 'zod'

/**
 * Schéma de validation pour POST /api/estimations/import
 *
 * Payload envoyé par la Skill Claude externe (claude.ai) à l'issue
 * d'une pré-estimation ou d'une estimation. `raw` est obligatoire :
 * c'est la donnée brute complète produite par la skill, conservée
 * intégralement pour ne rien perdre même si les champs structurés
 * ci-dessous sont partiels.
 */
export const estimationImportSchema = z.object({
  kind: z.enum(['pre_estimation', 'estimation']),
  contact: z
    .object({
      name: z.string().max(200).optional(),
      email: z.string().email().optional(),
      phone: z.string().max(30).optional(),
    })
    .optional(),
  property: z
    .object({
      address: z.string().max(300).optional(),
      city: z.string().max(120).optional(),
      type: z.string().max(80).optional(),
      surface: z.number().positive().max(100000).optional(),
    })
    .optional(),
  result: z
    .object({
      price_low: z.number().nonnegative().optional(),
      price_high: z.number().nonnegative().optional(),
      price_m2: z.number().nonnegative().optional(),
      confidence: z.number().min(0).max(100).optional(),
      summary: z.string().max(5000).optional(),
    })
    .optional(),
  raw: z.unknown().refine((value) => value !== undefined, {
    message: 'raw est obligatoire (donnée brute complète produite par la skill)',
  }),
  raw_filename: z.string().max(200).optional(),
  raw_format: z.string().max(20).optional(),
})

export type EstimationImportDto = z.infer<typeof estimationImportSchema>
