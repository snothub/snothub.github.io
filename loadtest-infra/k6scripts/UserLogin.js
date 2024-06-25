import http from 'k6/http';
import { sleep, group, check } from 'k6';

// Normal last
export const options = {
    scenarios: {
        //userLogin: {
        //    executor: 'ramping-vus',
        //    startVUs: 0,
        //    stages: [
        //        { duration: '1m', target: 1 },
        //        { duration: '1m', target: 3 },
        //        { duration: '1m', target: 5 },
        //        { duration: '1m', target: 7 },
        //        { duration: '1m', target: 3 },
        //        { duration: '1m', target: 0 }
        //    ]
        //},
        userLoginShort: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 1 },
                { duration: '1m', target: 3 },
                { duration: '1m', target: 5 },
                { duration: '1m', target: 7 },
            ]
        },
        //test: {
        //    executor: 'constant-vus',
        //    vus: 1,
        //    duration: '55s',
        //}
    }
};

let jsonHeader = {
    headers: {
        'Content-Type': 'application/json',
    },
    tags: { name: "" }
};

let formHeader = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
};

const connectAuthorizeQueryParameters =
    "?client_id=meny&response_type=code&scope=openid%20profile%20offline_access%20http://id.trumf.no/scopes/medlem%20api.trumfid&redirect_uri=https://preprod.meny.no/services/loginservice&state=Q8OqznuFiyQDz6YUCv_G&nonce=75aYyGIvdH_yi2QQmvNL&code_challenge=51FaJvQFsiNdiFWIq2EMWUKeAqD47dqU_cHzJpfHl-Q&code_challenge_method=S256";
            
let tokenCode = "";
function getTokenCodeFromUrl(url) {
    const queryString = url.split('?')[1];
    if (!queryString) return null;

    const firstParam = queryString.split('&')[0];
    const tokenCode = firstParam.split('=')[1];
    return tokenCode;
}

function paramsWithCorrectName(tagName) {
    return {
        redirects: 0,
        tags: { name: tagName }
    };
}

export default function userLogin() {
    const baseUrl = "https://dev.id.trumf.no";
    const redirectUrl = "https://preprod.meny.no/services/loginservice";
    const returnUrl = "%2fconnect%2fauthorize%2fcallback%3fclient_id%3dmeny%26response_type%3dcode%26scope%3dopenid%2520profile%2520offline_access%2520http%253A%252F%252Fid.trumf.no%252Fscopes%252Fmedlem%2520api.trumfid%26redirect_uri%3dhttps%253A%252F%252Fpreprod.meny.no%252Fservices%252Floginservice%26state%3dQ8OqznuFiyQDz6YUCv_G%26nonce%3d75aYyGIvdH_yi2QQmvNL%26code_challenge%3d51FaJvQFsiNdiFWIq2EMWUKeAqD47dqU_cHzJpfHl-Q%26code_challenge_method%3dS256";

    group('fullUserLogin', function () {
        group('connect/authorize', function () {
            let url = `${baseUrl}/connect/authorize`
            let res = http.get(url + connectAuthorizeQueryParameters, paramsWithCorrectName(url));

            while (res.status == 302) {
                url = res.headers["Location"];
                if (!url.includes(baseUrl)) {
                    url = baseUrl + res.headers["Location"]
                }

                res = http.get(url, paramsWithCorrectName(url.split('?')[0]));
            }

            check(res, {
                'Status 200': (r) => r.status === 200,
                'Correct Url': (r) => r.url && r.url.includes('/ui/login/start'),
                'Response time': (r) => r.timings.duration < 2500
            });
        });

        //frontend fetches data
        group('login/context', function () {
            let url = `${baseUrl}/trumfid/login/context`;
            let res = http.get(`${url}?returnUrl=` + returnUrl, paramsWithCorrectName(url));
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
            jsonHeader.tags.name = url
            let res = http.post(`${url}?returnUrl=` + returnUrl, userData, jsonHeader);

            check(res, {
                'Status 200': (r) => r.status === 200,
                'Response time': (r) => r.timings.duration < 2500
            });
        });
        sleep(5);

        //NB Ratelimiting ma skrus av pa bruker, ellers feiler denne
        group('password', function () {
            var passwordData = JSON.stringify({
                "password": "Test12345",
                "rememberMe": false
            });

            let url = `${baseUrl}/trumfid/login/pwd`;
            jsonHeader.tags.name = url
            let res = http.post(`${url}?returnUrl=` + returnUrl, passwordData, jsonHeader);

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
            jsonHeader.tags.name = url
            let res = http.post(`${url}?returnUrl=` + returnUrl, smsData, jsonHeader);

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
            let res = http.post(`${url}?rememberSkipRegistration=false&returnUrl=${returnUrl}%26acr_values%3Dcas%253Acompleted`, null, paramsWithCorrectName(url));

            while (res.status == 302) {
                url = res.headers["Location"];
                if (!url.includes(baseUrl) && !url.includes(redirectUrl)) {
                    url = baseUrl + res.headers["Location"]
                }

                res = http.get(url, paramsWithCorrectName(url.split('?')[0]));
            }

            tokenCode = getTokenCodeFromUrl(res.url)

            check(res, {
                //'Status 302': (r) => r.status === 302,
                //'Correct Url': (r) => res.url.includes('/connect/authorize/callback'),
                'Status 500': (r) => r.status === 500,
                'Correct Url': (r) => r.url && r.url.includes(redirectUrl),
                'Response time': (r) => r.timings.duration < 2500
            });
        });
        sleep(3);

        group('getToken', function () {
            var tokenData = {
                "client_id": "meny",
                "grant_type": "authorization_code",
                "code": tokenCode,
                "redirect_uri": redirectUrl,
                "scope": "openid%20profile%20offline_access%20http://id.trumf.no/scopes/medlem%20api.trumfid",
                "code_verifier": "c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646"
            };

            let res = http.post(`${baseUrl}/connect/token`, tokenData, formHeader);

            check(res, {
                'Status 200': (r) => r.status === 200 && r.body && r.body.includes('access_token'),
                'Response time': (r) => r.timings.duration < 2500
            });
        });

    });
}

