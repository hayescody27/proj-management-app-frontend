import { RequirementPhase } from "./requirement-phase.enum";
import { RequirementStatus } from "./requirement-status";
import { RequirementType } from "./requirement-type.enum";

export interface Requirement {
    reqId: string,
    description: string,
    type: RequirementType,
    currentPhase: RequirementPhase,
    statuses: RequirementStatus[],
    dueAt: number
}
