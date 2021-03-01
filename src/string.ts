function includesAny (str :string, ary :Array<string>) {
    let includes = false;
    ary.forEach((item)=>{
        if(str.includes(item)) {
            includes = true;
        }
    })
    return includes;
}

function speechReady (str :string) {
    return str.replace(/[&\/\\#()~'"<>{}]/g,'');
}

export { includesAny, speechReady }