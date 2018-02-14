Flamegraph server side generator. Heavily relies on Martin Spier's work: [node-stack-convert](https://github.com/spiermar/node-stack-convert) and [d3-flame-graph](https://github.com/spiermar/d3-flame-graph)
Works only with folded stack

Example usage: 

Raw input/ raw output: 
perf script | perl stackcollapse-perf.pl | curl --data-binary @- localhost:8080/api/generate`

Raw input/ zipped output: 
perf script | perl stackcollapse-perf.pl | curl --data-binary @- -H "Accept-Encoding: gzip" localhost:8080/api/generate`

Zipped input/ zipped output:
perf script | perl stackcollapse-perf.pl |gzip | curl --data-binary @- -H "Content-Type: gzip" -H "Accept-Encoding: gzip" localhost:8080/api/generate`

Plain text vs Zipped input time comparison (file size: 825 kb)
|Action              | Plain      | Zipped     |
---------------------|------------|-------------
|time_namelookup:    |0.005       | 0.005      |
|time_connect:       |0.173       | 0.158      |
|time_appconnect:    |0.722       | 0.688      |
|time_pretransfer:   |0.722       | 0.688      |
|time_redirect:      |0.000       | 0.000      |
|time_starttransfer: |0.842       | 0.884      |
|time_total:         |1.740       | 2.620      |
                 

Todo: 
0) tests
1) chrome e.getScreenCTM is not a function
    at SVGGElement.<anonymous> (d3.flameGraph.js:1)
    at SVGGElement.<anonymous> (d3.min.js:2)
2) code navigation
3) server side rendering with http://handlebarsjs.com/precompilation.html
4) additional color schemes
5) off-cpu
