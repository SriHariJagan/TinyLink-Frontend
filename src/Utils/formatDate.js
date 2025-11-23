export const formatDate = (iso) => {
  if (!iso || iso === "Never") return "Never";

  const date = new Date(iso);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
