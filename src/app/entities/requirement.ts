import { RequirementStatus } from "./requirement-status";
import { RequirementType } from "./requirement-type.enum";

export interface Requirement {
    reqId: string,
    description: string,
    type: RequirementType,
    statuses: RequirementStatus[],
    dueAt: number
}
