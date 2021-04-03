import { Requirement } from "./requirement";
import { Risk } from "./risk";
import { TeamMember } from "./team-member";

export interface Project {
    _id: string,
    pid: string,
    name: string,
    description: string,
    projectManager: string,
    members: TeamMember[],
    risks: Risk[],
    requirements: Requirement[],
    owner: string,
    createdAt: number
}
