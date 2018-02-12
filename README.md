Flamegraph server side generator. Heavily relies on Martin Spier's work: [node-stack-convert](https://github.com/spiermar/node-stack-convert) and [d3-flame-graph](https://github.com/spiermar/d3-flame-graph)
Works only with folded stack

Example usage: 

Raw input/ raw output: 
`perf report --stdio --no-children -n -g folded,0,caller,count -s comm | \
    awk '/^ / { comm = $3 } /^[0-9]/ { print comm ";" $2, $1 }' | curl --data-binary @- localhost:8080/api/generate`

Raw input/ zipped output: 
`perf report --stdio --no-children -n -g folded,0,caller,count -s comm | \
    awk '/^ / { comm = $3 } /^[0-9]/ { print comm ";" $2, $1 }' | curl --data-binary @- -H "Accept-Encoding: gzip" localhost:8080/api/generate`

Zipped input/ zipped output:
`perf report --stdio --no-children -n -g folded,0,caller,count -s comm | \
    awk '/^ / { comm = $3 } /^[0-9]/ { print comm ";" $2, $1 }'|gzip | curl --data-binary @- -H "Content-Type: gzip" -H "Accept-Encoding: gzip" localhost:8080/api/generate`

Zipped vs Unziped input chunks comparison
[16670] | [65536, 65536, 65536, 65536, 65536, 65536, 65536, 65536, 59660]

Todo: server side rendering with http://handlebarsjs.com/precompilation.html