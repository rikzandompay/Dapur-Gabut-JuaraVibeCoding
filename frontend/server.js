import worker from "./dist/server/index.js";

const PORT = process.env.PORT || 8080;

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Normalize path to prevent directory traversal
    const cleanPath = url.pathname.replace(/\.\./g, "");
    
    // If it's a request for a static asset, try to serve it
    if (cleanPath !== "/" && !cleanPath.includes("..")) {
      const file = Bun.file(`./dist/client${cleanPath}`);
      if (await file.exists()) {
        return new Response(file);
      }
    }
    
    // Otherwise, route to TanStack Start SSR handler
    try {
      return await worker.fetch(req, {}, {});
    } catch (e) {
      console.error("Worker error:", e);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
});

console.log(`Server running on http://localhost:${PORT}`);
