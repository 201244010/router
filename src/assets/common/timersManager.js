

const timers = [];

export default {
    get timers(){
        return timers;
    },

    add(timer){
        timers.push(timer);
        return timers;
    },

    flush(){
        timers.map((timer, i) => {
            if(timer){
                clearInterval(timer);
                clearTimeout(timer);
                timer.splice(i, 1);
            }
        })
    },

    remove(timer){
        timers.forEach((t, i) => {
            if(timer === t){
                clearInterval(timer);
                clearTimeout(timer);
                timer.splice(i, 1);
            }
        })
    }
    
};



