import z from "zod";

export const messageFormSchema = z.object({
  content: z.string().min(2, {
    message: "Message must be at least 2 characters.",
  }),
  model: z.string().min(1, {
    message: "Model is required.",
  }),
});
