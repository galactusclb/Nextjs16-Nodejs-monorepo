import z from "zod";

export type TableMetaData = {
  pageIndex: number;
  pageSize: PageSize;
  filters?: Record<string, FilterValue>;
};

export interface FilterValue {
	selectedOperator: SelectOperators;
	selectedOptions?: string[] | string | Date;
}

export type SelectOperators = 'equals'|  'in'|  'notIn'|  'not' | 'contains' | 'startsWith' | 'endsWith'

export const PageSizeSchema = z.union([
    z.literal(10),
    z.literal(15),
    z.literal(20),
    z.literal(25),
    z.literal(30),
    z.literal(40),
    z.literal(50),
]);

export type PageSize =  z.infer<typeof PageSizeSchema>

export const filterQueryParamsSchema = z.object({
    pageIndex: z.coerce.number().int().nonnegative().default(0),
    pageSize: z
        .coerce.number()
        .int()
        .refine((val) => PageSizeSchema.safeParse(val).success, {
            message: "Invalid pageSize, must be one of 10,15,20,25,30,40,50",
        })
        .default(15),
    filters: z.string().optional().transform(str =>
        str ? JSON.parse(str) : {}
    ).pipe(z.record(z.string(), z.any()).default({}))
})

export type filterQueryParams = z.infer<typeof filterQueryParamsSchema>


export interface ErrorPayload {
  status: "error" | "fail";
  code: number;
  message: string;
  error?: {
    type?: string;
    details?: Record<string, any>;
  };
  requestId?: string;
};