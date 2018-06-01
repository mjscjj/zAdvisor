console.log('child argv: ', 'MJSCJj');
process.stdin.pipe(process.stdout);

var compute =function (m){
   // console.log('child get message'+m)
    for(var m=0;m<100000000;m++){
        for(var j=0;j<100000000;j++){

            // process.stdout.write('.'+m)
            if(j>100000000){
                process.send(m);
            }
        }

        // process.stdout.write('.'+m)
    }

}

compute(30)
