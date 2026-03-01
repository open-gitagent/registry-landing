import Fuse from "fuse.js";
import type { Agent } from "./api";

let fuse: Fuse<Agent> | null = null;

export function search(query: string, agents: Agent[]): Agent[] {
  if (!query.trim()) return agents;
  if (!fuse) {
    fuse = new Fuse(agents, {
      keys: [
        { name: "name", weight: 2 },
        { name: "description", weight: 1.5 },
        { name: "author", weight: 1 },
        { name: "tags", weight: 1.5 },
        { name: "category", weight: 0.5 },
      ],
      threshold: 0.3,
      includeScore: true,
    });
  }
  return fuse.search(query).map((r) => r.item);
}
