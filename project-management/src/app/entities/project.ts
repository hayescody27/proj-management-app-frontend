import { Requirement } from "./requirement";
import { Risk } from "./risk";

export interface Project {
    id: string,
    name: string,
    description: string,
    projectManager: string,
    teamMembers: string[],
    risks: Risk[],
    requirements: Requirement[]
}
