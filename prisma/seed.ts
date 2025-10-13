import { PrismaClient, Role } from "@prisma/client";
import { title } from "process";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Example conversations
  const conversations = [
    {
      title: "Creating a very powerful AI assistant using Node.js",
      messages: [
        {
          role: Role.user,
          content:
            "How can I create a very powerful AI assistant using Node.js?",
        },
        {
          role: Role.assistant,
          content: `
## Building a Powerful AI Assistant with Node.js

Here’s a solid roadmap:

1. **Define your assistant's scope**  
   Decide what your AI should *actually do* — chat, automate tasks, fetch data, etc.

2. **Use OpenAI or a local model**  
Integrate via API or host your own model for better control.

3. **Persist context**  
Use a database (like Prisma + SQLite/PostgreSQL) to store conversations.

4. **Stream responses**  
Stream output to improve user experience using libraries like \`eventsource-parser\`.

5. **Frontend**  
React + TailwindCSS for the interface. For a minimal approach, start with a CLI app.

---
**Example Stack:**  
Node.js • TypeScript • Prisma • SQLite • OpenAI API • Next.js
        `,
        },
      ],
    },
    {
      title: "Structuring conversations in my AI app",
      messages: [
        {
          role: Role.user,
          content:
            "What’s the best way to structure conversations in my AI app?",
        },
        {
          role: Role.assistant,
          content: `
### Structuring Conversations

To maintain context, store messages like this:

\`\`\`typescript
type Conversation = {
  id: string;
  title?: string;
  messages: Message[];
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
};
\`\`\`

This structure allows:
- **Easy retrieval** of previous messages  
- **Chronological context** for the model  
- **Scalable data management** with Prisma relations
        `,
        },
      ],
    },
    {
      title: "Understanding Prisma relations",
      messages: [
        {
          role: Role.user,
          content:
            "Explain how Prisma relations work between Conversation and Message.",
        },
        {
          role: Role.assistant,
          content: `
### Prisma Relations (Conversation ↔ Message)

Each \`Conversation\` has many \`Message\` records.

\`\`\`prisma
model Conversation {
  id        String    @id @default(cuid())
  messages  Message[]
}

model Message {
  id             String       @id @default(cuid())
  role           Role
  content        String
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
}
\`\`\`

➡️ **Explanation:**
- \`conversationId\` in \`Message\` points to a specific \`Conversation\`.  
- \`onDelete: Cascade\` ensures all messages are deleted when their conversation is removed.
        `,
        },
      ],
    },
    {
      title: "Improving chatbot responses",
      messages: [
        {
          role: Role.user,
          content: "Give me ideas to improve my chatbot’s responses.",
        },
        {
          role: Role.assistant,
          content: `
### Improving Chatbot Responses

1. **Add memory** — Save key user preferences or facts.  
2. **Fine-tune or instruct better** — Provide better system prompts.  
3. **Use embeddings** — For knowledge-based context search.  
4. **Implement tone control** — Match the user's style (formal, fun, concise).  
5. **Feedback loop** — Let users rate responses to improve output over time.
        `,
        },
      ],
    },
  ];

  for (const conversation of conversations) {
    await prisma.conversation.create({
      data: {
        title: conversation.title,
        messages: {
          create: conversation.messages.map((msg) => ({
            role: msg.role,
            content: msg.content.trim(),
          })),
        },
      },
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
