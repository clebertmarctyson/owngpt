import MessageForm from "@/components/MessageForm";

export default function Home() {
  return (
    <div className="w-[50vw] h-screen overflow-hidden mx-auto py-8 flex flex-col justify-center items-center gap-8">
      <h1 className="text-4xl font-bold text-foreground">
        Hello, how can I assist you today?
      </h1>

      <MessageForm />
    </div>
  );
}
