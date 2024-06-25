import http from 'k6/http';
import { sleep, group, check } from 'k6';

// Normal last
export const options = {
    scenarios: {
        delegation: {
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
        },
        //delegationTest: {
        //    executor: 'ramping-vus',
        //    startVUs: 0,
        //    stages: [
        //        { duration: '1m', target: 1 },
        //    ]
        //}
    }
};

const params = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    tags: { name: "delegation" }
};

let initialData = {
    client_id: 'lasttest_id_long',
    grant_type: 'client_credentials',
    scope: 'lasttest_id'
};

export function setup() {
    let res = http.post('https://dev.id.trumf.no/connect/token', initialData, params);
    let delegationToken = res.json('access_token'); //M2M token, not user token

    return {
        client_id: 'lasttest_id',
        grant_type: 'delegation',
        audience: 'api.sylinder',
        token: delegationToken,
    };

}

export default function delegation(delegationData) {
    let res = http.post('https://dev.id.trumf.no/connect/token', delegationData, params);
    check(res, {
        'Status 200': (r) => r.status === 200 && r.body.includes('access_token'),
        'Response time': (r) => r.timings.duration < 1000
    });
}

