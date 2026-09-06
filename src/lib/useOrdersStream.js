"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useOrdersStream() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let activo = true;

    async function cargarInicial() {
      const { data } = await supabase
        .from("ordenes")
        .select("*")
        .order("numero", { ascending: false });
      if (activo && data) setOrders(data);
    }

    cargarInicial();

    const channel = supabase
      .channel("ordenes-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ordenes" },
        (payload) => {
          setOrders((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new, ...prev.filter((o) => o.numero !== payload.new.numero)];
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((o) => (o.numero === payload.new.numero ? payload.new : o));
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((o) => o.numero !== payload.old.numero);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      activo = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return orders;
}
