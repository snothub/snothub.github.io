import http from 'k6/http';
import { sleep, group, check } from 'k6';


// Normal last
export const options1 = {
    scenarios: {
      registration_scenario: {
        exec: 'registration',
        executor: 'ramping-vus',
        startVUs: 0,
        stages: [ 
            { duration: '2m', target: 1 }, 
            { duration: '15m', target: 1 }, 
            { duration: '2m', target: 0 } 
            ] 
      },
      authentication_scenario: {
        exec: 'authentication',
        executor: 'ramping-vus',
        startVUs: 0,
        stages: [
                { duration: '2m', target: 3 }, 
                { duration: '15m', target: 3 }, 
                { duration: '2m', target: 0 } 
        ]
      }
    }
};

// Normal last - øvre grense
export const options = {
    scenarios: {
      registration_scenario: {
        exec: 'registration',
        executor: 'ramping-vus',
        startVUs: 0,
        stages: [ 
            { duration: '2m', target: 1 }, 
            { duration: '15m', target: 1 }, 
            { duration: '2m', target: 0 } 
            ] 
      },
      authentication_scenario: {
        exec: 'authentication',
        executor: 'ramping-vus',
        startVUs: 0,
        stages: [
                { duration: '2m', target: 6 }, 
                { duration: '15m', target: 6 }, 
                { duration: '2m', target: 0 } 
        ]
      }
    }
};

// Nyhetsbrev
export const options3 = {
    scenarios: {
      registration_scenario: {
        exec: 'registration',
        executor: 'ramping-vus',
        startVUs: 0,
        stages: [ 
            { duration: '10m', target: 1 }, 
            { duration: '1m', target: 1 }, 
            { duration: '1m', target: 2 }, 
            { duration: '1m', target: 2 }, 
            { duration: '1m', target: 3 }, 
            { duration: '1m', target: 3 }, 
            { duration: '1m', target: 4 }, 
            { duration: '1m', target: 5 }, 
            { duration: '7m', target: 4 }, 
            { duration: '1m', target: 3 }, 
            { duration: '7m', target: 2 }, 
            { duration: '6m', target: 1 }, 
            { duration: '5m', target: 0 } 
        ], 
      },
      authentication_scenario: {
        exec: 'authentication',
        executor: 'ramping-vus',
        startVUs: 0,
        stages: [ 
            { duration: '10m', target: 4 }, 
            { duration: '1m', target: 6 }, 
            { duration: '1m', target: 9 }, 
            { duration: '1m', target: 12 }, 
            { duration: '1m', target: 13 }, 
            { duration: '1m', target: 24 }, 
            { duration: '1m', target: 38 }, 
            { duration: '1m', target: 40 }, 
            { duration: '7m', target: 32 }, 
            { duration: '1m', target: 27 }, 
            { duration: '7m', target: 25 }, 
            { duration: '6m', target: 20 }, 
            { duration: '5m', target: 0 } 
        ], 
      }
    }
};

// Stress test
export const options4 = {
    scenarios: {
      registration_scenario: {
        exec: 'registration',
        executor: 'ramping-vus',
        startVUs: 0,
        stages: [ 
            { duration: '2m', target: 1 }, // below normal load 
            { duration: '5m', target: 1 },  
            { duration: '2m', target: 1 }, // normal load 
            { duration: '5m', target: 1 },  
            { duration: '2m', target: 3 },  
            { duration: '5m', target: 3 },  
            { duration: '2m', target: 5 },  
            { duration: '5m', target: 5 }, 
            { duration: '2m', target: 10 },  
            { duration: '5m', target: 10 }, 
            { duration: '2m', target: 20 },   
            { duration: '5m', target: 20 }, 
            { duration: '2m', target: 50 },   
            { duration: '5m', target: 50 }, 
            { duration: '2m', target: 100 },  
            { duration: '5m', target: 100 }, 
            { duration: '5m', target: 0 } // scale down 
        ] 
      },
      authentication_scenario: {
        exec: 'authentication',
        executor: 'ramping-vus',
        startVUs: 0,
        stages: [ 
            { duration: '2m', target: 4 }, // below normal load 
            { duration: '5m', target: 4 },  
            { duration: '2m', target: 7 }, // normal load 
            { duration: '5m', target: 7 },  
            { duration: '2m', target: 22 },  
            { duration: '5m', target: 22 },  
            { duration: '2m', target: 45 },  
            { duration: '5m', target: 45 }, 
            { duration: '2m', target: 90 }, 
            { duration: '5m', target: 90 }, 
            { duration: '2m', target: 120 },  
            { duration: '5m', target: 120 }, 
            { duration: '2m', target: 200 }, 
            { duration: '5m', target: 200 }, 
            { duration: '2m', target: 300 },  
            { duration: '5m', target: 300 }, 
            { duration: '2m', target: 400 },  
            { duration: '5m', target: 400 }, 
            { duration: '5m', target: 0 } // scale down 
        ] 
      }
    }
};

const params = {
    headers: {
      'Content-Type': 'application/json',
    }
};

export function registration() {
    const cookie = 'CfDJ8FgvZ7cOjcFBv_tvXhfZuFineoBN7JcRXKryeK5jtY-Nccs4WoBMmiHwH35q6dXXRqbr9McSVIRa0YVhxeWLy1hYwNcf5RrqWjQmOTi-YvH4Y9M3Le5BEB_KJktHKprjf1pVTyZJ2Fwb-4yCJ5M2LQ503mPAA15dpCJW5CjzpxjLI0HKXgZj6Wd9RMLH-hXwAlFjHhA3Zp9J3UCRd8ir36Zx5DKFafmsQdW8WfGebiH6d-KKZFe6jdxohrZ_mspotxdlzwsy0NRkMEbuoYcVL8ttdDGVvIdlLnGQ3f5JbQOcM0EV9wm-XOlrVQ3lXTcOxecwgxhD_HryScdhVeaEwu5THHJa92zYpDtlphELOFQiE5K9pIxR-PSJV8NEcj4UGY9pMDQJluMroyDBmPE8cuTVrBMXlweJtzwr3SMy5gSnejohyowJ8BZEgrAKwhnRHm-WUhumHXMGZC41fFOjkG6qJW8qnmjil8ypZsttePXVm2MeZZUzP9a4DOgogGgU1q_sl7U5Q6X_rRv-g0-f1kad4pJ34SMdsoziJFcn-xoii6VWPUHvpaD3qdn6w9Id79uV9PygBLlRPIHLhKLG66vVl_4DEr85WRS-2tgtndVIS30C0o6Hndsxek2JWWI2m6JfbI2O4CQmAzx6IjNDCSqRTg0pJEyB8AesaQ_HCJeWQRTUd3NMnP-1cA06hu5HRcr4U0RqoBHWbQVxIH8z_5ZGJU4gQgp6_i8QUsdWcWLGE84wli0uuVIarg-Xk2X9tu-wHwMTorR6ro4bi_4jWuQuQDEPz_iojI9cq7wXdGJ1';
    const returnUrl = '%2fconnect%2fauthorize%2fcallback%3fresponse_type%3dcode%26client_id%3dpostman%26scope%3dopenid%2520profile%2520http%253A%252F%252Fid.trumf.no%252Fscopes%252Flegacy-token-read%2520http%253A%252F%252Fid.trumf.no%252Fscopes%252Flegacy-token-write%26redirect_uri%3dhttps%253A%252F%252Foauth.pstmn.io%252Fv1%252Fcallback%26code_challenge%3dVaOpbiWN5alVwiLMDSOOxs-FoyjdmSrRmJczs52bXaE%26code_challenge_method%3dS256%26acr_values%3dcas%253Acompleted';

    var fakeAttestation = JSON.stringify({
        "encodedCredential": "{\"Id\":\"/LvWQS/F/s8JddjvirIYlqoX3aBiJ2itcWrVKwXzNoE=\",\"RawId\":\"/LvWQS/F/s8JddjvirIYlqoX3aBiJ2itcWrVKwXzNoE=\",\"Type\":\"public-key\",\"Extensions\":{},\"Response\":{\"AttestationObject\":\"o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVkBZ3u0NgViY7JiEKSDiHtp15i0HhkYhyslIAlsasU3dVRTRQAAAAAAAAAAAAAAAAAAAAAAAAAAACD8u9ZBL8X+zwl12O+KshiWqhfdoGInaK1xatUrBfM2gaQBAwM5AQAgWQEAt/Qwb2hfXdDprL0L1I0814T5EQDEFqYQOadF8x4ToyJ3dok4E4sHVqGrXQLiIciaY9HJZlW9MUgn0TbfVc6wj5ahQpp3JMk4Xew6SqaljpgWGQBqLVllTrAx2JYBUwpAkgyO62PiKexNVGlzK0+9WV4GpHA++C6l1kOay7ZiRFW8n+IRVCFONN1powO9C1khyZRA4gvIQE3KXN6UcPsfoDCVe5Fepxpn00yWTTsjVKU3JZZSzkD4wQH57y9nhcodbihWBh6rKuS/Aed78SILopCOcr+cwk7pzk4HJ2QiQjDjkO4+YijwOpHkKQYet0Of6YpOEf3e4/5QgNNHIHazeyFDAQAB\",\"ClientDataJson\":\"eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQSIsIm9yaWdpbiI6Imh0dHBzOi8vdGVzdC5pZC50cnVtZi5ubyIsImNyb3NzT3JpZ2luIjpmYWxzZX0=\"}}",
        "transports": [
        "internal"
        ]
    });

    const jar = http.cookieJar();
    const url = 'test.id.trumf.no';
    jar.set(`https://${url}/`, 'idsrv.external', cookie);
    

    group('fullRegistration', function () {
        group('regContext', function () {
            let res = http.get(`https://${url}/trumfid/biometri/registration/context?returnUrl=`+returnUrl);
    
            let checkRes = check(res, {
                'Status 200': (r) => r.status === 200,
                'Response time': (r) => r.timings.duration < 3000
            });
        });
        sleep(3);
    
        group('regOptions', function () {
            let res = http.get(`https://${url}/trumfid/biometri/registration/options?returnUrl=`+returnUrl);
    
            let checkRes = check(res, {
                'Status 200': (r) => r.status === 200,
                'Response time': (r) => r.timings.duration < 3000
            });
        });
    
        sleep(6);
    
        group('register', function () {
            const registerUrl = `https://${url}/trumfid/registerbiometric?returnUrl=`+returnUrl;
            let res = http.post(registerUrl,fakeAttestation, params);
    
            let checkRes = check(res, {
                'Status 200': (r) => r.status === 200,
                'Response time': (r) => r.timings.duration < 3000
            });
        });
    });
    
};


export function authentication() {
    
    const cookie = 'CfDJ8FgvZ7cOjcFBv_tvXhfZuFgstVBSwuwZ85LeFe-uBjKEbIqj1-XUly8VB0DTN7D2bTncJ_czVZR84MOfy8qqeehgx4YkZjLZ4BGieYIp1WQjNb_UQgPTyQgr51-8fshu21drOgbvrKAAN4SB8znOOIrxixFIlGKtSGJ4ZZiYfZJEnLrQ5xKzmlKN7sQcCzGTK22fC5whUF1JBxPiqdqQwVPayyMCIougrTCH_6t-2T7HJ8FzjaZ7RZNmfsaxJmftj4jtFzAPmozG7MFauFZ_S-ndSFeoo9WpNKCsQfRZIQkzxH8kO7ouIYItM0XvN98H5pLBTG6WFNVSfH66TdImyWjq_Y8gahehWj0by_5oTki5vk7YXdSBNm8OAWqGr7nlj3BruAbWzwLAEOuIuu6W-dUpew0M3Xbd61lIlGkv7qCq7TWUMugLZFe80lIRVJUIrjfjBaB6bApBxoc4H0wdjWzr-AMZAMCxbvyp_Eh8Y9Y7';
    const returnUrl = '%2fconnect%2fauthorize%2fcallback%3fresponse_type%3dcode%26client_id%3dpostman%26scope%3dopenid%2520profile%2520http%253A%252F%252Fid.trumf.no%252Fscopes%252Flegacy-token-read%2520http%253A%252F%252Fid.trumf.no%252Fscopes%252Flegacy-token-write%26redirect_uri%3dhttps%253A%252F%252Foauth.pstmn.io%252Fv1%252Fcallback%26code_challenge%3dVaOpbiWN5alVwiLMDSOOxs-FoyjdmSrRmJczs52bXaE%26code_challenge_method%3dS256%26acr_values%3dcas%253Acompleted';
    const fakeAssertionLogin = JSON.stringify({"id": "QCm5BVw4W6S6ejJfSHQjPdokM784/iZSYM+6Rq6pBX8=", "rawId": "QCm5BVw4W6S6ejJfSHQjPdokM784/iZSYM+6Rq6pBX8=", "type": "public-key", "extensions": {}, "response": {"authenticatorData": "e7Q2BWJjsmIQpIOIe2nXmLQeGRiHKyUgCWxqxTd1VFMFAAAABw==", "clientDataJson": "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQSIsIm9yaWdpbiI6Imh0dHBzOi8vdGVzdC5pZC50cnVtZi5ubyIsImNyb3NzT3JpZ2luIjpmYWxzZSwib3RoZXJfa2V5c19jYW5fYmVfYWRkZWRfaGVyZSI6ImRvIG5vdCBjb21wYXJlIGNsaWVudERhdGFKU09OIGFnYWluc3QgYSB0ZW1wbGF0ZS4gU2VlIGh0dHBzOi8vZ29vLmdsL3lhYlBleCJ9", "signature": "BqIOwTwdwVJDCSx5sWX1/Y8iI8+9Xb69xcUvProgB0Wh322kmqL+/ZmqIK+YHuUNmHoG544o15G760I6iQe+Z477BGX2rvV+AoASeSm391i0H+JHjUGgycNK+5QwZhJ9i7Ilhpv1kCg4LtnKmOo7xyz37m3MN4vgpP4OtwU/QNalhPizkLdE54Aqb2zecVfiWhbVDVYdxbNccbZl2Ku//bvh7OKr4LeyrwcnzRT+Tsx5e2Z906HheZ90MQDV4NMG95Q4RaD/CYY4wyEATP0SEKfkVca3AEzwdQ5/6NSSWtjZ+DA8JqdSATab1NGv5C2AGDJXL+u/CGWew7mCZghrRg=="}});

    const jar = http.cookieJar();
    jar.set('https://test.id.trumf.no/', '.AspNetCore.biometri', cookie);

    group('fullAuthentication', function () {
        group('authContext', function () {
            let res = http.get('https://test.id.trumf.no/trumfid/login/context?returnUrl=' + returnUrl);
    
            let checkRes = check(res, {
                'Status 200': (r) => r.status === 200,
                'Response time': (r) => r.timings.duration < 3000
            });
        });
        sleep(3);
    
        group('authOptions', function () {
            let res = http.get('https://test.id.trumf.no/trumfid/biometri/login/options');
    
            let checkRes = check(res, {
                'Status 200': (r) => r.status === 200,
                'Response time': (r) => r.timings.duration < 3000
            });
        });
    
        sleep(6);
    
        group('authenticate', function () {
            const url = `https://test.id.trumf.no/trumfid/login/authenticate?returnUrl=${returnUrl}&providerName=BiometriIdentityProvider`;
            let res = http.post(url,fakeAssertionLogin);
    
            let checkRes = check(res, {
                'Status 200': (r) => r.status === 200,
                'Response time': (r) => r.timings.duration < 3000
            });
        });
    });
};