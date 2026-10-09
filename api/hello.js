
import { buildGreeting } from "../src/greeting.js";

export default function handler(request, response) {
  const name = request.query.name ?? "mundo";

  response.status(200).json({
    greeting: buildGreeting(name),
  });
}
