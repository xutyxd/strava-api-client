import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "../../openapi/specification";

import { IOAuthConfiguration } from "../interfaces/oauth-configuration.interface";
import { IOAuthResponse } from "../interfaces/oauth-response.interface";

import { ActivityStream } from "../enums/activity-stream.enum";
import { ActivityType } from "../enums/activity-type.enum";
import { SegmentStream } from "../enums/segment-stream.enum";
import { SportType } from "../enums/sport-type.enum";

export class Strava {

    private static API_URL = "https://www.strava.com/api/v3";
    private static readonly OAUTH_URL = 'https://www.strava.com/oauth';

    private client: ReturnType<typeof createClient<paths>>;
    private authentication?: string;

    private authenticate: Middleware = {
        onRequest: ({ request }) => {
            if (this.authentication) {
                request.headers.set('Authorization', `Bearer ${this.authentication}`);
            }

            return request;
        }
    }

    constructor(private configuration: IOAuthConfiguration) {
        this.client = createClient<paths>({ baseUrl: Strava.API_URL, headers: { Bearer: 'access_token' } });
        this.client.use(this.authenticate);
    }

    private OAuth = {
        url: {
            authorize: () => {
                const { client_id, redirect_uri, scopes } = this.configuration;
                return `${Strava.OAUTH_URL}/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scopes.join(",")}`;
            },
            token: () => {
                const { client_id, client_secret } = this.configuration;
                return `${Strava.OAUTH_URL}/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=authorization_code`;
            },
            deauthorize: () => {
                return `${Strava.OAUTH_URL}/deauthorize`;
            }
        }
    }

    public oauth = {
        authorize: () => {
            // Generate the url to authorize the user
            const url = this.OAuth.url.authorize();
            // Return the url
            return url;
        },
        token: async (code: string) => {
            // Generate the url to get the token
            const url = this.OAuth.url.token();
            // Get the token
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    code,
                    client_id: this.configuration.client_id,
                    client_secret: this.configuration.client_secret,
                    redirect_uri: this.configuration.redirect_uri,
                    grant_type: 'authorization_code'
                })
            });
            // Check if the response is ok
            if (!response.ok) {
                // Throw the error and handle who implement it
                throw response;
            }
            // Parse the response
            const oauthResponse = (await response.json()) as IOAuthResponse;
            // Set the authentication
            this.authentication = oauthResponse.access_token;
            // Return the token
            return oauthResponse;
        },
        deauthorize: async () => {
            const url = this.OAuth.url.deauthorize();
            // Call to deauthorize
            const response = await fetch(url);
            // Technically, the response is not needed
            // But it is good to check if the response is ok
            if (!response.ok) {
                // Throw the error and handle who implement it
                throw response;
            }
            // Return the response
            return response;
        },
        set: async (token: string) => {
            // Set the authentication
            this.authentication = token;
        }
    }
    
    public athlete = {
        me: async () => {
            // Get the athlete
            const response = await this.client.GET('/athlete');
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        activities: async (before?: number, after?: number, page?: number, per_page?: number) => {
            // Get the athlete
            const response = await this.client.GET('/athlete/activities', { params: { query: { before, after, page, per_page } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        clubs: async (page?: number, per_page?: number) => {
            // Get the athlete
            const response = await this.client.GET('/athlete/clubs', { params: { query: { page, per_page } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        zones: async () => {
            // Get the athlete
            const response = await this.client.GET('/athlete/zones');
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        routes: async (page?: number, per_page?: number) => {
            console.warn('Method athlete.routes not tested!');
            // Get the athlete
            const response = await this.client.GET('/athletes/{id}/routes', { params: { query: { page, per_page } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        stats: async (id: number) => {
            // Get the athlete
            const response = await this.client.GET('/athletes/{id}/stats', { params: { path: { id } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        update: async (weight: number) => {
            // Get the athlete
            const response = await this.client.PUT('/athlete', { params: { path: { weight } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        }
    }

    public segment = {
        get: async (id: number) => {
            // Get the segment
            const response = await this.client.GET('/segments/{id}', { params: { path: { id } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        starred: async (page?: number, per_page?: number) => {
            // Get the segment
            const response = await this.client.GET('/segments/starred', { params: { query: { page, per_page } }});
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        star: async (id: number, starred: boolean) => {
            // Get the segment
            const response = await this.client.PUT('/segments/{id}/starred', { params: { path: { id } }, body: { starred } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        explore: async (bounds: number[], activity_type?: 'running' | 'riding', min_cat?: number, max_cat?: number) => {
            // Get the segment
            const response = await this.client.GET('/segments/explore', { params: { query: { bounds, activity_type, min_cat, max_cat } }});
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        effort: {
            list: async (segment_id: number, start_date_local?: string, end_date_local?: string, per_page?: number) => {
                // Get the segment
                const response = await this.client.GET('/segment_efforts', { params: { query: { segment_id, start_date_local, end_date_local, per_page } }});
                // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
                // Return the data
                return response.data;
            },
            get: async (id: number) => {
                // Get the segment
                const response = await this.client.GET('/segment_efforts/{id}', { params: { path: { id } }});
                // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
                // Return the data
                return response.data;
            },
            stream: async (id: number, keys: SegmentStream[], key_by_type = true) => {
                // Get the segment
                const response = await this.client.GET('/segment_efforts/{id}/streams', { params: { path: { id }, query: { keys, key_by_type } }});
                // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
                // Return the data
                return response.data;
            }
        },
        stream: async (id: number, keys: SegmentStream[], key_by_type = true) => {
            // Get the segment
            const response = await this.client.GET('/segments/{id}/streams', { params: { path: { id }, query: { keys, key_by_type } }});
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        }
    }

    public activity = {
        create: async (name: string, sport_type: SportType, start_date_local: string, elapsed_time: number, type?: ActivityType, description?: string, distance?: number, trainer?: boolean, commute?: boolean, confidential?: boolean, flagged?: boolean, gear_id?: string) => {
            // Get the activity
            const response = await this.client.POST('/activities', { body: { name, type, sport_type, start_date_local, elapsed_time, description, distance, trainer: trainer ? 1 : 0, commute: commute ? 1 : 0, private: confidential, flagged, gear_id } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        get: async (id: number, include_all_efforts?: boolean) => {
            // Get the activity
            const response = await this.client.GET('/activities/{id}', { params: { path: { id }, query: { include_all_efforts } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        update: async (id: number, name?: string, type?: ActivityType, sport_type?: SportType, start_date_local?: string, elapsed_time?: number, description?: string, distance?: number, trainer?: boolean, commute?: boolean, confidential?: boolean, flagged?: boolean, gear_id?: string) => {
            // Get the activity
            const response = await this.client.PUT('/activities/{id}', { params: { path: { id } }, body: { name, type, sport_type, start_date_local, elapsed_time, description, distance, trainer, commute, private: confidential, flagged, gear_id } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        laps: async (id: number) => {
            // Get the activity
            const response = await this.client.GET('/activities/{id}/laps', { params: { path: { id } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        zones: async (id: number) => {
            // Get the activity
            const response = await this.client.GET('/activities/{id}/zones', { params: { path: { id } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        comments: async (id: number, page?: number, per_page?: number) => {
            // Get the activity
            const response = await this.client.GET('/activities/{id}/comments', { params: { path: { id }, query: { page, per_page } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        kudos: async (id: number, page?: number, per_page?: number) => {
            // Get the activity
            const response = await this.client.GET('/activities/{id}/kudos', { params: { path: { id }, query: { page, per_page } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        stream: async (id: number, keys: ActivityStream[], key_by_type = true) => {
            // Get the activity
            const response = await this.client.GET('/activities/{id}/streams', { params: { path: { id }, query: { keys, key_by_type } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        }
    }

    public club = {
        get: async (id: number) => {
            // Get the club
            const response = await this.client.GET('/clubs/{id}', { params: { path: { id } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        activities: async (id: number, page?: number, per_page?: number) => {
            // Get the club
            const response = await this.client.GET('/clubs/{id}/activities', { params: { path: { id }, query: { page, per_page } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        members: async (id: number, page?: number, per_page?: number) => {
            // Get the club
            const response = await this.client.GET('/clubs/{id}/members', { params: { path: { id }, query: { page, per_page } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        admins: async (id: number, page?: number, per_page?: number) => {
            // Get the club
            const response = await this.client.GET('/clubs/{id}/admins', { params: { path: { id }, query: { page, per_page } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        }
    }

    public gear = {
        get: async (id: string) => {
            // Get the gear
            const response = await this.client.GET('/gear/{id}', { params: { path: { id } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        }
    }

    public route = {
        get: async (id: number) => {
            // Get the route
            const response = await this.client.GET('/routes/{id}', { params: { path: { id } } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        export: {
            GPX: async (id: number) => {
                // Get the route
                const response = await this.client.GET('/routes/{id}/export_gpx', { params: { path: { id } }});
                // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
                // Return the data
                return response.data;
            },
            TCX: async (id: number) => {
                // Get the route
                const response = await this.client.GET('/routes/{id}/export_tcx', { params: { path: { id } }});
                // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
                // Return the data
                return response.data;
            }
        },
        stream: async (id: number) => {
            // Get the route
            const response = await this.client.GET('/routes/{id}/streams', { params: { path: { id } }});
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        }
    }

    public upload = {
        get: async (uploadId: number) => {
            // Get the upload
            const response = await this.client.GET('/uploads/{uploadId}', { params: { path: { uploadId } }});
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        },
        put: async (file: Blob, name?: string, description?: string, trainer?: boolean, commute?: boolean, data_type?: 'fit' | 'fit.gz' | 'tcx' | 'tcx.gz' | 'gpx' | 'gpx.gz') => {
            console.warn('Method upload.put not tested!');
            // Get the upload
            const response = await this.client.POST('/uploads', { body: { file: file as any as string, name, description, trainer: trainer ? '1' : '0', commute: commute ? '1' : '0', data_type } });
            // Throw the error if there is one
            if (response.error) {
                throw response.error;
            }
            // Return the data
            return response.data;
        }
    }
}