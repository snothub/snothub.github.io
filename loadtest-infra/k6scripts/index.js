import http from 'k6/http';
import { sleep, group, check } from 'k6';


// Meny push varsel
export const options = {
    setupTimeout: '2m',
    scenarios: {
        m2m: {
            exec: 'm2m',
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1m',
            preAllocatedVUs: 1,
            maxVUs: 5,
            stages: [
                { target: 30, duration: '5m' },
                { target: 30, duration: '5m' }, // normal last
                { target: 38, duration: '2m' }, // peak push 1
                { target: 37, duration: '10m' }, // peak push til ovre normal last
                { target: 37, duration: '15m' }, // ovre normal last
                { target: 38, duration: '2m' }, // peak push 2
                { target: 37, duration: '10m' }, // peak push til ovre normal last
                { target: 37, duration: '15m' }, // ovre normal last
                { target: 38, duration: '2m' }, // peak push 3
                { target: 37, duration: '10m' }, // peak push til ovre normal last
                { target: 37, duration: '15m' }, // ovre normal last
                { target: 30, duration: '5m' }, // normal last
            ],
        },
        delegation: {
            exec: 'delegation',
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1m',
            preAllocatedVUs: 60,
            maxVUs: 110,
            stages: [
                { target: 2114, duration: '5m' },
                { target: 2114, duration: '5m' }, // normal last
                { target: 14630, duration: '2m' }, // peak push 1
                { target: 2962, duration: '10m' }, // peak push til ovre normal last
                { target: 2962, duration: '15m' }, // ovre normal last
                { target: 14630, duration: '2m' }, // peak push 2
                { target: 2962, duration: '10m' }, // peak push til ovre normal last
                { target: 2962, duration: '15m' }, // ovre normal last
                { target: 14630, duration: '2m' }, // peak push 3
                { target: 2962, duration: '10m' }, // peak push til ovre normal last
                { target: 2962, duration: '15m' }, // ovre normal last
                { target: 2114, duration: '5m' }, // normal last
            ],
        },
        refreshToken: {
            exec: 'refreshToken',
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1m',
            preAllocatedVUs: 20,
            maxVUs: 40,
            stages: [
                { target: 187, duration: '5m' },
                { target: 187, duration: '5m' }, // normal last
                { target: 756, duration: '2m' }, // peak push 1
                { target: 253, duration: '10m' }, // peak push til ovre normal last
                { target: 253, duration: '15m' }, // ovre normal last
                { target: 756, duration: '2m' }, // peak push 2
                { target: 253, duration: '10m' }, // peak push til ovre normal last
                { target: 253, duration: '15m' }, // ovre normal last
                { target: 756, duration: '2m' }, // peak push 3
                { target: 253, duration: '10m' }, // peak push til ovre normal last
                { target: 253, duration: '15m' }, // ovre normal last
                { target: 187, duration: '5m' }, // normal last
            ],
            gracefulStop: '90s',
        },
        userLogin: {
            exec: 'userLogin',
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1m',
            preAllocatedVUs: 70,
            maxVUs: 120,
            stages: [
                { target: 34, duration: '5m' },
                { target: 34, duration: '5m' }, // normal last
                { target: 237, duration: '2m' }, // peak push 1
                { target: 58, duration: '10m' }, // peak push til ovre normal last
                { target: 58, duration: '15m' }, // ovre normal last
                { target: 237, duration: '2m' }, // peak push 2
                { target: 58, duration: '10m' }, // peak push til ovre normal last
                { target: 58, duration: '15m' }, // ovre normal last
                { target: 237, duration: '2m' }, // peak push 3
                { target: 58, duration: '10m' }, // peak push til ovre normal last
                { target: 58, duration: '15m' }, // ovre normal last
                { target: 34, duration: '5m' }, // normal last
            ],
            gracefulStop: '90s',
        }
    }
};
function jsonParamsWithCorrectName(tagName) {
    return {
        headers: {
            'Content-Type': 'application/json',
        },
        tags: { name: tagName }
    };
}

function redirectParamsWithCorrectName(tagName) {
    return {
        redirects: 0,
        tags: { name: tagName }
    };
}

function formParamsWithCorrectName(tagName) {
    return {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        tags: { name: tagName }
    };
}

//defining reusable constants
const baseUrl = "https://dev.id.trumf.no";
const clientId = "meny";
const redirectUrl = `https://preprod.${clientId}.no/services/loginservice`;
const returnUrl = `%2fconnect%2fauthorize%2fcallback%3fclient_id%3d${clientId}%26response_type%3dcode%26scope%3dopenid%2520profile%2520offline_access%2520http%253A%252F%252Fid.trumf.no%252Fscopes%252Fmedlem%2520api.trumfid%26redirect_uri%3dhttps%253A%252F%252Fpreprod.meny.no%252Fservices%252Floginservice%26state%3dQ8OqznuFiyQDz6YUCv_G%26nonce%3d75aYyGIvdH_yi2QQmvNL%26code_challenge%3d51FaJvQFsiNdiFWIq2EMWUKeAqD47dqU_cHzJpfHl-Q%26code_challenge_method%3dS256`;
const connectAuthorizeQueryParameters =
    `?client_id=${clientId}&response_type=code&scope=openid%20profile%20offline_access%20http://id.trumf.no/scopes/medlem%20api.trumfid&redirect_uri=${redirectUrl}&state=Q8OqznuFiyQDz6YUCv_G&nonce=75aYyGIvdH_yi2QQmvNL&code_challenge=51FaJvQFsiNdiFWIq2EMWUKeAqD47dqU_cHzJpfHl-Q&code_challenge_method=S256`;

const lasttestClientId = "lasttest_id";

export function setup() {

    //Setup for delegation flow
    let delegationData = {
        client_id: 'lasttest_id_long', 
        grant_type: 'client_credentials',
        scope: 'lasttest_id'
    };

    let res = http.post(`${baseUrl}/connect/token`, delegationData, formParamsWithCorrectName("m2m"));
    let delegationToken = res.json('access_token'); //M2M token, not user token

    //Setup for refreshtoken flow
    let refreshToken = "";
    
    let jsonHeader = {
        headers: {
            'Content-Type': 'application/json',
        },
        tags: { name: "setup" }
    };

    while (!refreshToken || refreshToken.length === 0) {
        http.get(`${baseUrl}/connect/authorize` + connectAuthorizeQueryParameters);

        var userData = JSON.stringify({
            "phoneNumber": "94555555",
            "companyUser": false
        });
        http.post(`${baseUrl}/trumfid/login/validateUser?returnUrl=${returnUrl}`, userData, jsonHeader);

        var passwordData = JSON.stringify({
            "password": "Test12345",
            "rememberMe": false
        });
        http.post(`${baseUrl}/trumfid/login/pwd?returnUrl=${returnUrl}`, passwordData, jsonHeader);

        var smsData = JSON.stringify({
            "otp": "159357",
            "rememberMeSms": false
        });
        http.post(`${baseUrl}/trumfid/smsCode?returnUrl=${returnUrl}`, smsData, jsonHeader);

        let res = http.post(`${baseUrl}/trumfid/biometri/registration/skip?rememberSkipRegistration=false&returnUrl=${returnUrl}%26acr_values%3Dcas%253Acompleted`);
        let tokenCode = getTokenCodeFromUrl(res.url)
        var tokenData = {
            "client_id": clientId,
            "grant_type": "authorization_code",
            "code": tokenCode,
            "redirect_uri": redirectUrl,
            "scope": "openid%20profile%20offline_access%20http://id.trumf.no/scopes/medlem%20api.trumfid",
            "code_verifier": "c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646"
        };

        res = http.post(`${baseUrl}/connect/token`, tokenData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        refreshToken = res.json('refresh_token')
    }

    return {
        delegationToken: delegationToken,
        refreshToken: refreshToken
    }
    
}


export function m2m() {
    group('m2m', function () {
        let data = {
            client_id: lasttestClientId,
            grant_type: 'client_credentials',
            scope: 'api.sylinder'
        };

        let res = http.post(`${baseUrl}/connect/token`, data, formParamsWithCorrectName("m2m"));

        check(res, {
            'Status 200': (r) => r.status === 200 && r.body.includes('access_token'),
            'Response time': (r) => r.timings.duration < 1000
        });
    });
}

export function delegation(setUpData) {
    group('delegation', function () {
        let data = {
            client_id: lasttestClientId,
            grant_type: 'delegation',
            audience: 'api.sylinder',
            token: setUpData.delegationToken,
        };

        let res = http.post(`${baseUrl}/connect/token`, data, formParamsWithCorrectName("delegation"));
        check(res, {
            'Status 200': (r) => r.status === 200 && r.body.includes('access_token'),
            'Response time': (r) => r.timings.duration < 1000
        });
    });
}

function getTokenCodeFromUrl(url) {
    const queryString = url.split('?')[1];
    if (!queryString) return null;

    const firstParam = queryString.split('&')[0];
    const tokenCode = firstParam.split('=')[1];
    return tokenCode;
}

export function refreshToken(setUpData) {
    group('refreshToken', function () {
        let refreshData = {
            client_id: clientId,
            grant_type: 'refresh_token',
            refresh_token: setUpData.refreshToken,
        };

        let res = http.post(`${baseUrl}/connect/token`, refreshData, formParamsWithCorrectName("refreshtoken"));
        check(res, {
            'Status 200': (r) => r.status === 200 && r.body.includes('access_token'),
            'Response time': (r) => r.timings.duration < 1000
        });
    });
}

export function userLogin() {

    let tokenCode = "";

    group('fullUserLogin', function () {
        group('connect/authorize', function () {
            let url = `${baseUrl}/connect/authorize`
            let res = http.get(url + connectAuthorizeQueryParameters, redirectParamsWithCorrectName(url));

            while (res.status == 302) {
                url = res.headers["Location"];
                if (!url.includes(baseUrl)) {
                    url = baseUrl + res.headers["Location"]
                }

                res = http.get(url, redirectParamsWithCorrectName(url.split('?')[0]));
            }

            check(res, {
                'Status 200': (r) => r.status === 200,
                'Correct Url': (r) => r.url && r.url.includes('/ui/login/start'),
                'Response time': (r) => r.timings.duration < 2500
            });
        });
        group('login/context', function () {
            let url = `${baseUrl}/trumfid/login/context`;
            let res = http.get(`${url}?returnUrl=` + returnUrl, redirectParamsWithCorrectName(url));
            check(res, {
                'Status 200': (r) => r.status === 200,
                'Response time': (r) => r.timings.duration < 2500
            });
        });

        sleep(3);


        group('validateUser', function () {
            var userData = JSON.stringify({
                "phoneNumber": "94555555",
                "companyUser": false
            });

            let url = `${baseUrl}/trumfid/login/validateUser`;
            let res = http.post(`${url}?returnUrl=` + returnUrl, userData, jsonParamsWithCorrectName(url));

            check(res, {
                'Status 200': (r) => r.status === 200,
                'Response time': (r) => r.timings.duration < 2500
            });
        });
        sleep(5);

        //NB Remember to turn sms ratelimiting of for the user, else this group will fail
        group('password', function () {
            var passwordData = JSON.stringify({
                "password": "Test12345",
                "rememberMe": false
            });

            let url = `${baseUrl}/trumfid/login/pwd`;
            let res = http.post(`${url}?returnUrl=` + returnUrl, passwordData, jsonParamsWithCorrectName(url));

            check(res, {
                'Status 200': (r) => r.status === 200,
                'Correct Url': (r) => r.json('redirect') && r.json('redirect').includes('ui/smsCode'),
                'Response time': (r) => r.timings.duration < 2500
            });
        });
        sleep(4);

        group('smsCode', function () {
            var smsData = JSON.stringify({
                "otp": "159357",
                "rememberMeSms": false
            });

            let url = `${baseUrl}/trumfid/smscode`;
            let res = http.post(`${url}?returnUrl=` + returnUrl, smsData, jsonParamsWithCorrectName(url));

            check(res, {
                'Status 200': (r) => r.status === 200,
                'Correct Url': (r) => r.json('redirect') && r.json('redirect').includes('ui/registerbiometric'),
                'Response time': (r) => r.timings.duration < 2500
            });
        });
        sleep(4);

        //Skips biometri registration
        group('registerBiometric', function () {
            let url = `${baseUrl}/trumfid/biometri/registration/skip`;
            let res = http.post(`${url}?rememberSkipRegistration=false&returnUrl=${returnUrl}%26acr_values%3Dcas%253Acompleted`, null, redirectParamsWithCorrectName(url));

            while (res.status == 302) {
                url = res.headers["Location"];
                if (!url.includes(baseUrl) && !url.includes(redirectUrl)) {
                    url = baseUrl + res.headers["Location"]
                }

                res = http.get(url, redirectParamsWithCorrectName(url.split('?')[0]));
            }

            tokenCode = getTokenCodeFromUrl(res.url)

            check(res, {
                // due to following redirects all the way to preprod.meny is a 500 response expected 
                'Status 500': (r) => r.status === 500,
                'Correct Url': (r) => r.url && r.url.includes(redirectUrl),
                'Response time': (r) => r.timings.duration < 2500
            });
        });
        sleep(3);

        group('getToken', function () {
            var tokenData = {
                "client_id": clientId,
                "grant_type": "authorization_code",
                "code": tokenCode,
                "redirect_uri": redirectUrl,
                "scope": "openid%20profile%20offline_access%20http://id.trumf.no/scopes/medlem%20api.trumfid",
                "code_verifier": "c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646"
            };
            let url = `${baseUrl}/connect/token`;
            let res = http.post(url, tokenData, formParamsWithCorrectName(url));

            check(res, {
                'Status 200': (r) => r.status === 200 && r.body && r.body.includes('access_token'),
                'Response time': (r) => r.timings.duration < 2500
            });
        });

    });
}

