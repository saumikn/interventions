import { type HttpClient, OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';

export const lichessHost = 'https://lichess.org';
export const scopes = [''];
export const clientId = 'lichess-api-demo';

export interface Me {
	id: string;
	username: string;
	httpClient: HttpClient; // with pre-set Authorization header
	perfs: { [key: string]: any };
}

export class Auth {
	oauth: OAuth2AuthCodePKCE;
	me?: Me;
	constructor() {
		const BASE_PATH = location.pathname.replace(/\/$/, '');
		const clientUrl = `${location.protocol}//${location.host}${BASE_PATH || '/'}`;
		this.oauth = new OAuth2AuthCodePKCE({
			authorizationUrl: `${lichessHost}/oauth`,
			tokenUrl: `${lichessHost}/api/token`,
			clientId,
			scopes,
			redirectUrl: clientUrl,
			onAccessTokenExpiry: (refreshAccessToken) => refreshAccessToken(),
			onInvalidGrant: console.warn
		});
	}

	async init() {
		let accessContext, hasAuthCode;
		try {
			accessContext = await this.oauth.getAccessToken();
		} catch (err) {
			console.log('TODO: Error 1 in Auth.init');
		}
		if (accessContext) {
			await this.authenticate();
		} else if (!this.me) {
			try {
				hasAuthCode = await this.oauth.isReturningFromAuthServer();
			} catch (err) {
				console.log('TODO: Error 2 in Auth.init');
			}
			if (hasAuthCode) {
				await this.authenticate();
			}
		}
	}

	private authenticate = async () => {
		const httpClient = this.oauth.decorateFetchHTTPClient(window.fetch);
		const res = await httpClient(`${lichessHost}/api/account`);
		const me = {
			...(await res.json()),
			httpClient
		};
		if (me.error) throw me.error;
		this.me = me;
	};

	async login() {
		await this.oauth.fetchAuthorizationCode();
	}

	async logout() {
		if (this.me)
			await this.me.httpClient(`${lichessHost}/api/token`, {
				method: 'DELETE'
			});
		localStorage.clear();
		this.me = undefined;
	}
}
