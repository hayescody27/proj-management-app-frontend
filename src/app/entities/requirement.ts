import { RequirementStatus } from "./requirement-status";

export interface Requirement {
    id: string,
    description: string,
    type: string,
    status: RequirementStatus[]
}
