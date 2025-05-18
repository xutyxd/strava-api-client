import { Scope } from "../enums/scope.enum";

export interface IOAuthConfiguration {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    scopes: Scope[];
    // authorization_uri: string;
    // token_uri: string;
    // revoke_uri: string;
}