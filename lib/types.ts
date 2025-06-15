import { z } from "zod";

export const CompileResponse = z.object({
    abi: z.array(z.any()),
    bytecode: z.string().min(1), // Remove the 0x requirement to handle both formats
});

export type CompileResponseType = z.infer<typeof CompileResponse>;

export const CompileFormSchema = z.object({
    source: z.string().min(1, "Solidity source code is required"),
});

export type CompileFormData = z.infer<typeof CompileFormSchema>;
