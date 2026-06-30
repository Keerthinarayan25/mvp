"use client";

import { useEffect } from "react";
import { connectSocket } from "@/hooks/useSocket";

export default function TestPage() {

  useEffect(() => {

    async function init() {

      try {

        const socket = await connectSocket();

        socket.on("connect", () => {
          console.log("CONNECTED", socket.id);
        });

        socket.on("connect_error", (err) => {
          console.log(err.message);
        });

      } catch (err) {

        console.error(err);

      }

    }

    init();

  }, []);

  return <h1>Socket Test</h1>;

}