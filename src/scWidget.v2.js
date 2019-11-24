
const scWidget = new (class {

    constructor(){
        this._SC_cliendId = '';
        this.$elmt = null;
        this.audioElmt = null;
        this.$parent = null;
        this._soundcloudWidget = null;
        this._soundcloudWidgetOptions = {
            volume:20
        };

        this.EVENTS = {
            PROGRESS:'progress',
            ENDED:'ended',
        };
        this.EventCallbacks = {};

        navigator.mediaSession.setActionHandler('previoustrack', function() {
            console.log('> User clicked "Previous Track" icon.');
        });

        navigator.mediaSession.setActionHandler('nexttrack', function() {
            console.log('> User clicked "Next Track" icon.');
        });
    }

    _createElement(){
        this.$elmt = jQuery(`<audio id="scwdg1" controls src=""> Your browser does not support the <code>audio</code> element. </audio>`);
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


    changeTrack(id, track){
        if(!this.audioHTML) this._createElement();
        this.stop();

        let basic_url = track.stream_url+'?client_id='+this._SC_cliendId;
        this.audioHTML.src = basic_url;

        /* testing ... todo:remove */
        function updateMediaSessionData(){
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.user.username,
                album: '',
                artwork: [ { src:track.artwork_url } ]
            });
        }

        this.play()
            .then(_ => updateMediaSessionData())
            .catch(console.error);

        //this.updateMediaSessionData(id, track);
        
        /*window.setTimeout(()=>{
            this.setVolume();
            let player = this._soundcloudWidget;
            this.bindEvents(player);
            //player.bind(SC.Widget.Events.READY, function(){ $d(SC.Widget.Events.READY); });
            //player.bind(SC.Widget.Events.PLAY, function(){ $d(SC.Widget.Events.PLAY); });
            //player.bind(SC.Widget.Events.PAUSE , function(){ $d(SC.Widget.Events.PAUSE ); });
            //player.bind(SC.Widget.Events.FINISH , function(){ $d(SC.Widget.Events.FINISH ); });
            //player.bind(SC.Widget.Events.SEEK  , function(){ $d(SC.Widget.Events.SEEK  ); });
            this.play();
        },800);*/
    }





    play(){
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
        return this.audioHTML.pause();
    }

    stop(){
        return this.audioHTML.pause();
    }



    async getVolume(){
        if(!this._soundcloudWidget) return;
        return new Promise((res,rej)=>{
            this._soundcloudWidget.getVolume(res);
        });
    }

    setVolume(v){
        // v=0-100
        if(!this._soundcloudWidget) return;
        if(v!==0 && !v) v=this._soundcloudWidgetOptions.volume;
        v=Math.max(1,v);
        v=Math.min(100,v);
        this._soundcloudWidgetOptions.volume=v;
        this._soundcloudWidget.setVolume(v);
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
        if(this.audioHTML.fastSeek){
            this.audioHTML.fastSeek(p);
        }else{
            this.audioHTML.currentTime = p;
        }
    }

    getPositionPercentage(){
        if(!this.audioHTML) return;
        return +(this.getPosition()*100/this.getDuration()).toFixed(1);
    }


});
