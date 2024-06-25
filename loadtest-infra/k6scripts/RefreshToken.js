import http from 'k6/http';
import { sleep, group, check } from 'k6';

// Normal last
export const options = {
    setupTimeout: '2m',
    scenarios: {
        //refreshtoken: {
        //    executor: 'ramping-vus',
        //    startVUs: 0,
        //    stages: [
        //        { duration: '1m', target: 1 },
        //        { duration: '1m', target: 3 },
        //        { duration: '1m', target: 5 },
        //    ]
        //},
        refreshtokenTest: {
            executor: 'ramping-vus',
            exec: 'refreshtoken',
            startVUs: 1,
            stages: [
                { duration: '2m', target: 3 },
            ]
        }
    }
};

function getTokenCodeFromUrl(url) {
    const queryString = url.split('?')[1];
    if (!queryString) return null;

    const firstParam = queryString.split('&')[0];
    const tokenCode = firstParam.split('=')[1];
    return tokenCode;
}

export function setup() {
    let refreshToken = "";
    const baseUrl = "https://dev.id.trumf.no";
    const redirectUrl = "https://preprod.meny.no/services/loginservice";
    const returnUrl = "%2fconnect%2fauthorize%2fcallback%3fclient_id%3dmeny%26response_type%3dcode%26scope%3dopenid%2520profile%2520offline_access%2520http%253A%252F%252Fid.trumf.no%252Fscopes%252Fmedlem%2520api.trumfid%26redirect_uri%3dhttps%253A%252F%252Fpreprod.meny.no%252Fservices%252Floginservice%26state%3dQ8OqznuFiyQDz6YUCv_G%26nonce%3d75aYyGIvdH_yi2QQmvNL%26code_challenge%3d51FaJvQFsiNdiFWIq2EMWUKeAqD47dqU_cHzJpfHl-Q%26code_challenge_method%3dS256";
    const connectAuthorizeQueryParameters =
        "?client_id=meny&response_type=code&scope=openid%20profile%20offline_access%20http://id.trumf.no/scopes/medlem%20api.trumfid&redirect_uri=https://preprod.meny.no/services/loginservice&state=Q8OqznuFiyQDz6YUCv_G&nonce=75aYyGIvdH_yi2QQmvNL&code_challenge=51FaJvQFsiNdiFWIq2EMWUKeAqD47dqU_cHzJpfHl-Q&code_challenge_method=S256";

    let jsonHeader = {
        headers: {
            'Content-Type': 'application/json',
        }
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
            "client_id": "meny",
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
    

    let refreshData = {
        client_id: 'meny',
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    };
    console.log(refreshData);
    return refreshData;
    

}

const params = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    tags: { name: "refreshtoken" }
};

export function refreshtoken(refreshData) {
    let res = http.post('https://dev.id.trumf.no/connect/token', refreshData, params);
    console.log(res);
    check(res, {
        'Status 200': (r) => r.status === 200 && r.body.includes('access_token'),
        'Response time': (r) => r.timings.duration < 1000
    });
}

