import toast from "react-hot-toast";

function ChatPage() {
  return (
    <div>
      ChatPage
      <button onClick={() => toast.success("you clicked")}>Click</button>
    </div>
  );
}

export default ChatPage;
