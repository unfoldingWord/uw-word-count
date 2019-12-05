// utilities


// function to convert map to object
export const map_to_obj = ( mp => {
    const ob = {};
    mp.forEach((v,k) => {ob[k]=v});
    return ob;
});

// function to convert object to a map
export const obj_to_map = ( ob => {
    const mp = new Map();
    Object.keys ( ob ).forEach (k => { mp.set(k, ob[k]) });
    return mp;
});

