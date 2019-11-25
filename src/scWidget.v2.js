
const scWidget = new (class {

    constructor(){
        this._SC_cliendId = '';
        this.$elmt = null;
        this.$parent = null;
        this._soundcloudWidget = null;
        this._soundcloudWidgetOptions = {
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
        this._soundcloudWidgetOptions.progCb = fn;
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

        this._soundcloudWidgetOptions.progInterval = null;

        this.play()
            .then(_ => updateMediaSessionData())
            .catch(console.error);

        //this.updateMediaSessionData(id, track);
    }





    play(){
        if(!this._soundcloudWidgetOptions.progInterval){
            this._soundcloudWidgetOptions.progInterval = window.setInterval(()=>{
                this._soundcloudWidgetOptions.progCb(this.audioHTML.currentTime,this.audioHTML.getPositionPercentage(),this.audioHTML.duration);
            },800);
        }
        return this.audioHTML.play();
    }

    playToggle(){
        if(this.audioHTML.paused===false){
            this.audioHTML.pause();
            return false;
        }
        this.audioHTML.play();
        return true;
    }

    pause(){
        if(this._soundcloudWidgetOptions.progInterval){
            window.clearInterval(this._soundcloudWidgetOptions.progInterval);
            this._soundcloudWidgetOptions.progInterval = null;
        }
        return this.audioHTML.pause();
    }

    stop(){
        return this.audioHTML.pause();
    }



    getVolume(){
        if(!this.audioHTML) return;
        return this.audioHTML.volume*100;
    }

    setVolume(v){
        // v=0-100
        if(!this.audioHTML) return;
        if(v!==0 && !v) v=this._soundcloudWidgetOptions.volume;
        v=Math.max(0,v);
        v=Math.min(100,v);
        this._soundcloudWidgetOptions.volume=v;
        this.audioHTML.volume = v/100;
    }


    getDuration(){
        if(!this.audioHTML) return;
        return this.audioHTML.duration;
    }

    getPosition(){
        if(!this.audioHTML) return;
        return this.audioHTML.currentTime;
    }

    setPosition(p, offset){
        if(!this.audioHTML) return;
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
        if(!this.audioHTML) return;
        return +(this.getPosition()*100/this.getDuration()).toFixed(1);
    }


});
