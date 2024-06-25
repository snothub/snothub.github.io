import http from 'k6/http';
import { sleep, group, check } from 'k6';

// Normal last
export const options = {
    scenarios: {
        m2m: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 1 },
                { duration: '1m', target: 3 },
                { duration: '1m', target: 5 },
                { duration: '1m', target: 7 },
                //{ duration: '1m', target: 3 },
                //{ duration: '2m', target: 0 }
            ]
        }
    }
};

const params = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    tags: { name: "m2m" }
};

let data = {
    client_id: 'lasttest_id',
    grant_type: 'client_credentials',
    scope: 'api.sylinder'
};


export default function m2m() {
    let res = http.post('https://dev.id.trumf.no/connect/token', data, params);

    check(res, {
        'Status 200': (r) => r.status === 200 && r.body.includes('access_token'),
        'Response time': (r) => r.timings.duration < 1000
    });
}

