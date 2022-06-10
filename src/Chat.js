function Chat() {
  const params = new URLSearchParams(window.location.search)

  return (
    <div>
      HOPR mini chat
      { params.get("securityToken") }
    </div>
  );
}

export default Chat;
