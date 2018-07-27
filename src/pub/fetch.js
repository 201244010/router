
export function fetch(){
    return new Promise(function(resolve, reject){
        setTimeout(()=>{
            resolve({
                name : 'lily'
            })
        }, 2000)
    })
}

