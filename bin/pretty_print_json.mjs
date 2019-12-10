import { readFile, writeFile } from 'fs';

const obj_to_map = ( ob => {
    const mp = new Map();
    Object.keys ( ob ).forEach (k => { mp.set(k, ob[k]) });
    return mp;
});

let input = 'tree.txt';

readFile(input, (err, data) => {
    if (err) throw err;

    let s = ""+data;
    s = JSON.parse(s);
    writeFile(input+".json",JSON.stringify(s, undefined, 4), 
        function(err) {
            if (err) {
                return console.log(err);
            }
        }
    );

});

