import { Scopes } from "../enums/scopes.enum";

export interface IOAuthConfiguration {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    scopes: Scopes[];
    // authorization_uri: string;
    // token_uri: string;
    // revoke_uri: string;
}