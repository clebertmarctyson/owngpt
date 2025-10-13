import { v4 as uuidv4 } from "uuid";

export type Message = {
  id: number;
  content: string;
  role: "user" | "assistant";
};

export type Conversation = {
  id: number;
  title: string;
  messages: Message[];
};

export const conversations: Conversation[] = [
  {
    id: 1,
    title: "Process of creating a very powerful AI assistant",
    messages: [
      {
        id: 1,
        role: "user",
        content: `
I want to build a truly powerful AI assistant — not just a chatbot, but something that can **reason, learn, and take actions**.  
Where should I start, and what architecture would you recommend?
        `,
      },
      {
        id: 2,
        role: "assistant",
        content: `
Great ambition. Here's the practical roadmap:

1. **Define the core capabilities** — e.g. reasoning, retrieval, automation, or personal memory.  
2. **Start modularly** — one system per skill:  
   - NLP core (e.g. LLM or local model)  
   - Memory layer (vector database like *Pinecone*, *Chroma*, or *Weaviate*)  
   - Tool execution layer (Node.js APIs, Python functions, etc.)  
3. **Containerize** each part with Docker for scalability.  
4. **Add orchestration logic** — using an agent framework (LangChain, AutoGen, or your own).  
5. **Focus on feedback loops** — the assistant improves based on results and user interactions.

Build small, automate fast, and measure results continuously.
        `,
      },
    ],
  },

  {
    id: 2,
    title: "Navigate the complex world of web development",
    messages: [
      {
        id: 1,
        role: "user",
        content: `
Web development feels overwhelming — frameworks, libraries, backend, frontend, DevOps...  
How do I organize my learning path without getting lost?
        `,
      },
      {
        id: 2,
        role: "assistant",
        content: `
Here's a **practical progression** that avoids chaos:

1. **HTML, CSS, JavaScript** — absolute foundations.  
2. **Frontend framework** — React or Vue. Master one deeply.  
3. **Backend basics** — Node.js + Express (or NestJS if you like structure).  
4. **Database fundamentals** — PostgreSQL + Prisma (ORM) or MongoDB (NoSQL).  
5. **APIs & Authentication** — JWT, OAuth, REST, GraphQL.  
6. **DevOps essentials** — Git, Docker, CI/CD, deployment to cloud (Vercel, Render, or AWS).  

Never try to learn everything at once. Build **one full project per stack layer**, then combine them.
        `,
      },
    ],
  },

  {
    id: 3,
    title: "Mastering the art of music composition",
    messages: [
      {
        id: 1,
        role: "user",
        content: `
I’ve been producing tracks for a while, but I feel like I’m just following patterns.  
How can I **truly master music composition** and create something original?
        `,
      },
      {
        id: 2,
        role: "assistant",
        content: `
To move from patterns to mastery:

1. **Study harmony** — understand chord functions, progressions, and modulation.  
2. **Analyze songs you admire** — focus on tension, release, and motif development.  
3. **Train your ear** daily with interval and chord recognition apps.  
4. **Compose with emotion first**, then structure technically.  
5. **Experiment with modes and time signatures** to break habits.  
6. **Limit your tools** — creativity grows when boundaries exist.

Originality is not about inventing new notes — it’s about *recombining emotions with intent*.
        `,
      },
    ],
  },

  {
    id: 4,
    title: "Exploring the mysteries of the universe",
    messages: [
      {
        id: 1,
        role: "user",
        content: `
Sometimes I wonder… what exactly is the universe made of?  
Is everything really just atoms and energy — or is there something deeper behind it all?
        `,
      },
      {
        id: 2,
        role: "assistant",
        content: `
That’s a timeless question. Scientifically, the universe is about **5% matter, 27% dark matter, and 68% dark energy** — the rest is mystery.  
But beneath physics lies something deeper: **structure and information**.

Every particle behaves like a data point in a cosmic computation.  
Some theories — like *digital physics* or *holographic principles* — propose that the universe itself might be a projection of information.

So yes, atoms and energy are part of it… but consciousness might be the next frontier of understanding what truly binds reality together.
        `,
      },
    ],
  },

  {
    id: 5,
    title: "Unveiling the secrets of quantum physics",
    messages: [
      {
        id: 1,
        role: "user",
        content: `
Quantum mechanics always confuses me.  
Can you explain, in simple terms, what makes quantum physics so different from classical physics?
        `,
      },
      {
        id: 2,
        role: "assistant",
        content: `
Here’s the simplest way to see it:

- **Classical physics** deals with things we can see — predictable, measurable, and deterministic.  
- **Quantum physics** deals with the invisible — particles so small that probability replaces certainty.

At that level:  
- A particle can exist in **multiple states** at once (superposition).  
- Measuring it **changes** the outcome (observer effect).  
- Two particles can stay **connected across distance** (entanglement).

It’s not magic — it’s how reality behaves at its most fundamental scale.
        `,
      },
    ],
  },

  {
    id: 6,
    title: "Navigating the vast expanse of the cosmos",
    messages: [
      {
        id: 1,
        role: "user",
        content: `
If humanity wanted to travel beyond our solar system, what would it realistically take?  
Are we anywhere close to interstellar travel?
        `,
      },
      {
        id: 2,
        role: "assistant",
        content: `
Short answer: **not yet**, but we’re getting closer.

1. **Distance problem** — even the nearest star (Proxima Centauri) is 4.24 light-years away.  
2. **Current tech** — our fastest probe (Voyager 1) would take 75,000+ years to get there.  
3. **Future concepts**:  
   - *Solar sails* — use sunlight or lasers for propulsion.  
   - *Fusion drives* — compress atoms for near-relativistic speeds.  
   - *AI-controlled probes* — explore without needing humans onboard.  

We’re not ready to go yet — but our **data, AI, and energy** advancements are laying the foundation.  
The first interstellar probe of our species will likely launch **within this century**.
        `,
      },
    ],
  },
];
