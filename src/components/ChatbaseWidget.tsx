import { useEffect } from 'react';
/**
 * ChatbaseWidget handles the injection of the Chatbase AI chatbot script.
 * It follows the initialization logic provided by the client.
 */
export function ChatbaseWidget() {
  useEffect(() => {
    // Initialize window.chatbase if not already present
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args: any[]) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q;
          }
          return (...args: any[]) => target(prop, ...args);
        }
      });
    }
    const onLoad = () => {
      // Prevent duplicate script injection
      if (document.getElementById("wGUY1AZgDAOz3yBfPXfai")) return;
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "wGUY1AZgDAOz3yBfPXfai";
      script.setAttribute("domain", "www.chatbase.co");
      document.body.appendChild(script);
    };
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);
  return null;
}
// Add type definition for window.chatbase to avoid TS errors
declare global {
  interface Window {
    chatbase: any;
  }
}