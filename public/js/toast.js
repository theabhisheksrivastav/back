function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const colors = {
    info: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500"
  };

  const toast = document.createElement("div");
  toast.className = `text-white px-4 py-2 rounded shadow ${colors[type] || colors.info} animate-slideIn`;
  toast.textContent = message;

  container.appendChild(toast);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.add("animate-slideOut");
    toast.addEventListener("animationend", () => toast.remove());
  }, 3000);
}

export default showToast;
