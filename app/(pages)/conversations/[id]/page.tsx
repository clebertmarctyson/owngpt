"use client";

import { useParams } from "next/navigation";

const Conversation = () => {
  const { id } = useParams();

  return <div>Conversation ID: {JSON.stringify(id)}</div>;
};

export default Conversation;
