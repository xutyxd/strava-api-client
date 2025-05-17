import { components } from "../../openapi/specification";

export interface IOAuthResponse {
    token_type: string;
    expires_at: number;
    expires_in: number;
    refresh_token: string;
    access_token: string;
    athlete: components["schemas"]["DetailedAthlete"];
}