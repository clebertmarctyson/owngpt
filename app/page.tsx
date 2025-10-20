import NewConversationForm from "@/components/conversation/NewConversationForm";

const Home = () => {
  return (
    <div className="w-[50vw] h-screen overflow-hidden mx-auto py-8 flex flex-col gap-4 items-center justify-center">
      <h1 className="font-bold text-4xl">Hello, how can I assist you today?</h1>
      <NewConversationForm />
    </div>
  );
};

export default Home;
