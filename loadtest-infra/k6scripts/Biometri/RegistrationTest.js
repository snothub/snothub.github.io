import http from 'k6/http';
import { sleep, group, check } from 'k6';

const cookie = 'CfDJ8FgvZ7cOjcFBv_tvXhfZuFineoBN7JcRXKryeK5jtY-Nccs4WoBMmiHwH35q6dXXRqbr9McSVIRa0YVhxeWLy1hYwNcf5RrqWjQmOTi-YvH4Y9M3Le5BEB_KJktHKprjf1pVTyZJ2Fwb-4yCJ5M2LQ503mPAA15dpCJW5CjzpxjLI0HKXgZj6Wd9RMLH-hXwAlFjHhA3Zp9J3UCRd8ir36Zx5DKFafmsQdW8WfGebiH6d-KKZFe6jdxohrZ_mspotxdlzwsy0NRkMEbuoYcVL8ttdDGVvIdlLnGQ3f5JbQOcM0EV9wm-XOlrVQ3lXTcOxecwgxhD_HryScdhVeaEwu5THHJa92zYpDtlphELOFQiE5K9pIxR-PSJV8NEcj4UGY9pMDQJluMroyDBmPE8cuTVrBMXlweJtzwr3SMy5gSnejohyowJ8BZEgrAKwhnRHm-WUhumHXMGZC41fFOjkG6qJW8qnmjil8ypZsttePXVm2MeZZUzP9a4DOgogGgU1q_sl7U5Q6X_rRv-g0-f1kad4pJ34SMdsoziJFcn-xoii6VWPUHvpaD3qdn6w9Id79uV9PygBLlRPIHLhKLG66vVl_4DEr85WRS-2tgtndVIS30C0o6Hndsxek2JWWI2m6JfbI2O4CQmAzx6IjNDCSqRTg0pJEyB8AesaQ_HCJeWQRTUd3NMnP-1cA06hu5HRcr4U0RqoBHWbQVxIH8z_5ZGJU4gQgp6_i8QUsdWcWLGE84wli0uuVIarg-Xk2X9tu-wHwMTorR6ro4bi_4jWuQuQDEPz_iojI9cq7wXdGJ1';
const returnUrl = '%2fconnect%2fauthorize%2fcallback%3fresponse_type%3dcode%26client_id%3dpostman%26scope%3dopenid%2520profile%2520http%253A%252F%252Fid.trumf.no%252Fscopes%252Flegacy-token-read%2520http%253A%252F%252Fid.trumf.no%252Fscopes%252Flegacy-token-write%26redirect_uri%3dhttps%253A%252F%252Foauth.pstmn.io%252Fv1%252Fcallback%26code_challenge%3dVaOpbiWN5alVwiLMDSOOxs-FoyjdmSrRmJczs52bXaE%26code_challenge_method%3dS256%26acr_values%3dcas%253Acompleted';
const localCookie = 'CfDJ8FgvZ7cOjcFBv_tvXhfZuFic5qgOTiJhQOxyBLx9YUB3LkXxyFa913oCmYg5_pX_-eBElQ5O-tlcbGypTE1mmhKuEH6e_cf8JnsXvCqYy4ycLQYMHU7udKRFP5UkwD-PaT-GV4zbaPie0piHvpscy_BDFV_O230CoxkqujragxUT4If_wjHHpfehwEYDYq6f-tf2qL2yIQ1V469X6bxuGtAgeQxFkOUmra15qQRiE2cp60mfbo5cnfmOPzMdP_pvNa20GxeA9pamrIlgrK_BwcEZaDiqQNeeCeuFzTAjwI6Pg_as_AZbqnylarYx9m4C4bWDrKhxBtrckcffKCzeagKUf33jVhr03vWIBLUisQCKrrNonXFUntqAipYy47HV36D3eKIdjLjTZsSy7yyDZKsQZZtJVy2albgOHugicW3M-A7mDnf6QB2TSHz1U01R302FfpVXxHWc336wGQsyFuAFnSd3MLWxsTJaxABsupdFO9omPwQohCig2RDsn0Oo_BKpE1jljPjh8-ebDfyxvVb7Z9etVwDyL31QSO2hcjZDd2Koq-NauSSOTtKNuwdLy3fSXY1bwFmwOhcb-E1WS9YPrFpjSThaA0WxDB4-DK434t_d69yqMfSi9wet525e1l57q-opCUYLj9INMXBE5oQrfhl2VQ6YkvO3xJIi3iNBjICKxPOeuuYDHKXrAfURuxRYoa-daRqBHL_2WsEHG2dBovpUfdSJM1_m6nLfZkVfXBhNtV6xvrp-BTYCI1tEHAjtzo24XTTulFxC06iDJ4rWDrgGHM2k5VHycLymJ7lf3ojXGHsh4WTe1hTDLr5ABw';

var fakeAttestation = JSON.stringify({
    "encodedCredential": "{\"Id\":\"/LvWQS/F/s8JddjvirIYlqoX3aBiJ2itcWrVKwXzNoE=\",\"RawId\":\"/LvWQS/F/s8JddjvirIYlqoX3aBiJ2itcWrVKwXzNoE=\",\"Type\":\"public-key\",\"Extensions\":{},\"Response\":{\"AttestationObject\":\"o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVkBZ3u0NgViY7JiEKSDiHtp15i0HhkYhyslIAlsasU3dVRTRQAAAAAAAAAAAAAAAAAAAAAAAAAAACD8u9ZBL8X+zwl12O+KshiWqhfdoGInaK1xatUrBfM2gaQBAwM5AQAgWQEAt/Qwb2hfXdDprL0L1I0814T5EQDEFqYQOadF8x4ToyJ3dok4E4sHVqGrXQLiIciaY9HJZlW9MUgn0TbfVc6wj5ahQpp3JMk4Xew6SqaljpgWGQBqLVllTrAx2JYBUwpAkgyO62PiKexNVGlzK0+9WV4GpHA++C6l1kOay7ZiRFW8n+IRVCFONN1powO9C1khyZRA4gvIQE3KXN6UcPsfoDCVe5Fepxpn00yWTTsjVKU3JZZSzkD4wQH57y9nhcodbihWBh6rKuS/Aed78SILopCOcr+cwk7pzk4HJ2QiQjDjkO4+YijwOpHkKQYet0Of6YpOEf3e4/5QgNNHIHazeyFDAQAB\",\"ClientDataJson\":\"eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQSIsIm9yaWdpbiI6Imh0dHBzOi8vdGVzdC5pZC50cnVtZi5ubyIsImNyb3NzT3JpZ2luIjpmYWxzZX0=\"}}",
    "transports": [
      "internal"
    ]
  });


export const options = {
    vus: 1,
    iterations: 2,
};

export const options2 = {
    stages: [
        { duration: '1m', target: 40 },
        { duration: '1m', target: 90 },
        { duration: '1m', target: 105 },
        // { duration: '1m', target: 105 },
        // { duration: '1m', target: 40 },
        // { duration: '30s', target: 0 },
    ],
};

const params = {
    headers: {
      'Content-Type': 'application/json',
    }
};

const localUrl = 'localhost';
const devUrl = 'test.id.trumf.no';

export default function () {
    const jar = http.cookieJar();
    const url = devUrl;
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
    
}