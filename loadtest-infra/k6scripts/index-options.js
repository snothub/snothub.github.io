// Normal last
export const options = {
    setupTimeout: '2m',
    scenarios: {
        m2m: {
            exec: 'm2m',
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1m',
            preAllocatedVUs: 1,
            maxVUs: 3,
            stages: [
                { target: 30, duration: '5m' },
                { target: 30, duration: '10m' },
            ],
        },
        delegation: {
            exec: 'delegation',
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1m',
            preAllocatedVUs: 20,
            maxVUs: 30,
            stages: [
                { target: 2114, duration: '5m' },
                { target: 2114, duration: '10m' },
            ],
        },
        refreshToken: {
            exec: 'refreshToken',
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1m',
            preAllocatedVUs: 3,
            maxVUs: 10,
            stages: [
                { target: 187, duration: '5m' },
                { target: 187, duration: '10m' },
            ],
            gracefulStop: '90s',
        },
        userLogin: {
            exec: 'userLogin',
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1m',
            preAllocatedVUs: 30,
            maxVUs: 50,
            stages: [
                { target: 34, duration: '5m' },
                { target: 34, duration: '10m' },
            ],
            gracefulStop: '90s',
        }
    }
};

// okt last - TrippelTrumfTorsdag
export const options = {
    setupTimeout: '2m',
    scenarios: {
        m2m: {
            exec: 'm2m',
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1m',
            preAllocatedVUs: 1,
            maxVUs: 3,
            stages: [
                { target: 37, duration: '5m' },
                { target: 37, duration: '10m' },
            ],
        },
        delegation: {
            exec: 'delegation',
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1m',
            preAllocatedVUs: 20,
            maxVUs: 30,
            stages: [
                { target: 2962, duration: '5m' },
                { target: 2962, duration: '10m' },
            ],
        },
        refreshToken: {
            exec: 'refreshToken',
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1m',
            preAllocatedVUs: 3,
            maxVUs: 10,
            stages: [
                { target: 253, duration: '5m' },
                { target: 253, duration: '10m' },
            ],
            gracefulStop: '90s',
        },
        userLogin: {
            exec: 'userLogin',
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1m',
            preAllocatedVUs: 30,
            maxVUs: 50,
            stages: [
                { target: 58, duration: '5m' },
                { target: 58, duration: '10m' },
            ],
            gracefulStop: '90s',
        }
    }
};

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