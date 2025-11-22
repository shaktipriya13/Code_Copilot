export const errorHandler = (err, req, res, next) => {
  console.error(err);

  let message = err.message || "Internal server error";

  try {
    if (message.startsWith("{") && message.includes("error")) {
      const parsed = JSON.parse(message);
      message = parsed.error?.message || JSON.stringify(parsed);
    }
  } catch (e) {
    // ignore parse errors
  }

  res.status(500).json({ error: message });
};
