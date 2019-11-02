const scSearchUtils_String = new (class {

    constructor(){
    }

    msToDuration(milliseconds){
        const seconds = Math.floor((milliseconds / 1000) % 60),
              minutes = Math.floor((milliseconds / (1000 * 60)) % 60),
              hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
        let str = "";
        let flag = false;
        if(flag || hours>0) {
            flag=true;
            str+=hours.toString().padStart(2,'0')+':';
        }
        if(flag || minutes>0) {
            flag=true;
            str+=minutes.toString().padStart(2,'0')+':';
        }
        if(flag || seconds>0) {
            flag=true;
            str+=seconds.toString().padStart(2,'0');
        }
        return str;
    }

});
uu.string = scSearchUtils_String;
