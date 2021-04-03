import { RiskStatus } from "./risk-status-enum";

export interface Risk {
    id: string,
    description: string,
    status: RiskStatus
}
