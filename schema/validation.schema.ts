import { z } from "zod";

import { AI_MODELS } from "@/lib/constants";

const modelValues = AI_MODELS.map((m) => m.value) as [string, ...string[]];

export const messageSchema = z.object({
  content: z.string().min(2, {
    message: "Message must be at least 2 characters.",
  }),
  model: z.enum(modelValues),
});

export type MessageFormData = z.infer<typeof messageSchema>;
