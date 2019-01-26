import http from "k6/http";
import {check} from "k6";
import {Rate} from "k6/metrics";

export let errorRate = new Rate("errors");
const data = open("./hub.json");

export let options = {
    thresholds: {
        "errors": ["rate<0.01"], // <1% errors
        http_req_duration: ["avg<100", "p(95)<800"]
    },
    vus: 5,
    duration: "30s"
};

export default function () {
    var params =  { headers: { "user-agent": `VU: ${__VU}  -  ITER: ${__ITER}` } }
    let res = http.post("http://localhost:8080/api/generate", data, params);
    check(res, {
        "status was 200": (r) => r.status == 200
    }) || errorRate.add(1);
};