import z from "zod";

import { messageFormSchema } from "@/lib/schemas";

export type MessageFormType = z.infer<typeof messageFormSchema>;
