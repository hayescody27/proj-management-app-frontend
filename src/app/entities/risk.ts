import { RiskStatus } from "./risk-status.enum";

export interface Risk {
    riskId: string,
    description: string,
    status: RiskStatus
}
