import http from 'k6/http';
import { sleep, group, check } from 'k6';

const cookie = 'CfDJ8FgvZ7cOjcFBv_tvXhfZuFgstVBSwuwZ85LeFe-uBjKEbIqj1-XUly8VB0DTN7D2bTncJ_czVZR84MOfy8qqeehgx4YkZjLZ4BGieYIp1WQjNb_UQgPTyQgr51-8fshu21drOgbvrKAAN4SB8znOOIrxixFIlGKtSGJ4ZZiYfZJEnLrQ5xKzmlKN7sQcCzGTK22fC5whUF1JBxPiqdqQwVPayyMCIougrTCH_6t-2T7HJ8FzjaZ7RZNmfsaxJmftj4jtFzAPmozG7MFauFZ_S-ndSFeoo9WpNKCsQfRZIQkzxH8kO7ouIYItM0XvN98H5pLBTG6WFNVSfH66TdImyWjq_Y8gahehWj0by_5oTki5vk7YXdSBNm8OAWqGr7nlj3BruAbWzwLAEOuIuu6W-dUpew0M3Xbd61lIlGkv7qCq7TWUMugLZFe80lIRVJUIrjfjBaB6bApBxoc4H0wdjWzr-AMZAMCxbvyp_Eh8Y9Y7';
const returnUrl = '%2fconnect%2fauthorize%2fcallback%3fresponse_type%3dcode%26client_id%3dpostman%26scope%3dopenid%2520profile%2520http%253A%252F%252Fid.trumf.no%252Fscopes%252Flegacy-token-read%2520http%253A%252F%252Fid.trumf.no%252Fscopes%252Flegacy-token-write%26redirect_uri%3dhttps%253A%252F%252Foauth.pstmn.io%252Fv1%252Fcallback%26code_challenge%3dVaOpbiWN5alVwiLMDSOOxs-FoyjdmSrRmJczs52bXaE%26code_challenge_method%3dS256%26acr_values%3dcas%253Acompleted';


const fakeAssertionLogin = JSON.stringify({"id": "QCm5BVw4W6S6ejJfSHQjPdokM784/iZSYM+6Rq6pBX8=", "rawId": "QCm5BVw4W6S6ejJfSHQjPdokM784/iZSYM+6Rq6pBX8=", "type": "public-key", "extensions": {}, "response": {"authenticatorData": "e7Q2BWJjsmIQpIOIe2nXmLQeGRiHKyUgCWxqxTd1VFMFAAAABw==", "clientDataJson": "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQSIsIm9yaWdpbiI6Imh0dHBzOi8vdGVzdC5pZC50cnVtZi5ubyIsImNyb3NzT3JpZ2luIjpmYWxzZSwib3RoZXJfa2V5c19jYW5fYmVfYWRkZWRfaGVyZSI6ImRvIG5vdCBjb21wYXJlIGNsaWVudERhdGFKU09OIGFnYWluc3QgYSB0ZW1wbGF0ZS4gU2VlIGh0dHBzOi8vZ29vLmdsL3lhYlBleCJ9", "signature": "BqIOwTwdwVJDCSx5sWX1/Y8iI8+9Xb69xcUvProgB0Wh322kmqL+/ZmqIK+YHuUNmHoG544o15G760I6iQe+Z477BGX2rvV+AoASeSm391i0H+JHjUGgycNK+5QwZhJ9i7Ilhpv1kCg4LtnKmOo7xyz37m3MN4vgpP4OtwU/QNalhPizkLdE54Aqb2zecVfiWhbVDVYdxbNccbZl2Ku//bvh7OKr4LeyrwcnzRT+Tsx5e2Z906HheZ90MQDV4NMG95Q4RaD/CYY4wyEATP0SEKfkVca3AEzwdQ5/6NSSWtjZ+DA8JqdSATab1NGv5C2AGDJXL+u/CGWew7mCZghrRg=="}});




export const options = {
    vus: 1,
    iterations: 2,
};


export default function () {
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
}