
const scWidget = new (class {

    constructor(){
        this._SC_cliendId = '';
        this.$elmt = null;
        this.$parent = null;
        this._widgetOptions = {
            volume:100,
            progInterval:null,
            progCb:()=>{}
        };

        this.EVENTS = {
            PROGRESS:'progress',
            ENDED:'ended',
        };
        this.EventCallbacks = {};
    }

    _createElement(){
        this.$elmt = jQuery(`<audio id="scwdg1" controls src="" style="display:none;"> 
            Your browser does not support the <code>audio</code> element. 
            </audio>`);
        this.$parent.prepend(this.$elmt);
        this.audioHTML = this.$elmt[0];
        this.bindEvents(this.audioHTML);
    }

    setParent(q){
        this.$parent = jQuery(q);
    }

    setSoundcloudClientID(clientid){
        this._SC_cliendId = clientid;
    }

    addEventCb(ev,cb){
        if(!this.EventCallbacks[ev]) this.EventCallbacks[ev]=[];
        this.EventCallbacks[ev].push(cb);
    }

    bindEvents(player){
        Object.keys(this.EventCallbacks).forEach((ev)=>{
            this.EventCallbacks[ev].forEach((cb)=>{
                player.addEventListener(ev, cb);
            });
        });
    }

    setProgressionCb(fn){
        // expected params: currentTime, currentTimePerc, duration
        this._widgetOptions.progCb = fn;
    }

    
    callProgressionCb(){
        this._widgetOptions.progCb(this.audioHTML.currentTime,this.getPositionPercentage(),this.audioHTML.duration);
    }


    _startProgEvent(){
        if(!this._widgetOptions.progInterval){
            this._widgetOptions.progInterval = window.setInterval(()=>{
                this.callProgressionCb();
            },800);
        }
    }

    _stopProgEvent(){
        if(this._widgetOptions.progInterval){
            window.clearInterval(this._widgetOptions.progInterval);
            this._widgetOptions.progInterval = null;
        }
    }


    changeTrack(id, track){
        if(!this.audioHTML) this._createElement();
        this.stop();

        let basic_url = track.stream_url+'?client_id='+this._SC_cliendId;
        this.audioHTML.src = basic_url;
        this.audioHTML.muted = false;
        this.setVolume();

        /* testing ... todo:remove */
        function updateMediaSessionData(){
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.user.username,
                album: '',
                artwork: [ { src:track.artwork_url } ]
            });
        }

        this._widgetOptions.progInterval = null;

        this.play()
            .then(_ => updateMediaSessionData())
            .catch(console.error);

        //this.updateMediaSessionData(id, track);
    }


    play(){
        this._startProgEvent();
        return this.audioHTML.play();
    }

    playToggle(){
        if(this.audioHTML.paused===false){
            this.pause();
            return false;
        }
        this.play();
        return true;
    }

    pause(){
        this._stopProgEvent();
        return this.audioHTML.pause();
    }

    stop(){
        return this.pause();
    }



    getVolume(){
        return this.audioHTML.volume*100;
    }

    setVolume(v){
        // v=0-100
        if(v!==0 && !v) v=this._widgetOptions.volume;
        v=Math.max(0,v);
        v=Math.min(100,v);
        this._widgetOptions.volume=v;
        this.audioHTML.volume = v/100;
    }


    getDuration(){
        return this.audioHTML.duration;
    }

    getPosition(){
        return this.audioHTML.currentTime;
    }

    setPosition(p, offset){
        const dt = this.getDuration();
        if(offset===true){
            const cp = this.getPosition();
            p = p+cp;
        }
        if(p<1) p=0;
        if(p>=dt) return;
        this.audioHTML.currentTime = p;
    }

    getPositionPercentage(){
        return +(this.getPosition()*100/this.getDuration()).toFixed(1);
    }


});
