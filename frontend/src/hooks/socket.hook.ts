import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ModelSocketMap } from "../shared/shared.data";
import { socket } from "../socket.io";
import { ModelType } from "../enums/enums";

export const useSocketInvalidation = (...models: ModelType[]) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const listeners: { event: string; handler: () => void }[] = [];

    models.forEach((model) => {
      const socketEvents = ModelSocketMap[model];

      socketEvents.forEach((event) => {
        const handler = () => {
          queryClient.invalidateQueries({
            queryKey: [model.toLowerCase()],
          });
        };

        socket.on(event, handler);

        listeners.push({ event, handler });
      });
    });

    return () => {
      listeners.forEach(({ event, handler }) => {
        socket.off(event, handler);
      });
    };
  }, [models, queryClient]);
};
