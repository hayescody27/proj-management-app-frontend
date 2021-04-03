import { RequirementPhase } from "./requirement-phase.enum";

export interface RequirementStatus {
    phase: RequirementPhase,
    expendedHours: number
}
