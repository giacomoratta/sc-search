
const scWidget = new (class {

    constructor(){
        this._SC_cliendId = '';
        this.$elmt = null;
        this.$parent = null;
        this._soundcloudWidget = null;
        this._soundcloudWidgetOptions = {
            volume:20
        };

        this.EVENTS = SC.Widget.Events;
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
                player.bind(ev, cb);
            });
        });
    }


    changeTrack(id, track){
        this.stop();
        if(!this.$elmt) this._createElement();

        let basic_url = track.stream_url+'?client_id='+this._SC_cliendId;
        //this.$elmt.attr('src',basic_url);

        function updateMediaSessionData(){
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.user.username,
                album: '',
                artwork: [ { src:track.artwork_url } ]
            });


        }

        const audio = this.$elmt[0];
        audio.src = basic_url;
        audio.play()
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
        //if(!this._soundcloudWidget) return;
        //this._soundcloudWidget.play();
    }

    stop(){
        //if(!this._soundcloudWidget) return;
        //this._soundcloudWidget.pause();
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


    async getDuration(){
        //if(!this._soundcloudWidget) return;
        return new Promise((res,rej)=>{
            //this._soundcloudWidget.getDuration(res);
            return 0;
        });
    }

    async getPosition(){
        //if(!this._soundcloudWidget) return;
        return new Promise((res,rej)=>{
            //this._soundcloudWidget.getPosition(res);
            return 0;
        });
    }

    async setPosition(p, offset){
        if(!this._soundcloudWidget) return;
        const dt = await this.getDuration();
        if(offset===true){
            const cp = await this.getPosition();
            p = p+cp;
        }
        if(p<0 || p>=dt) return;
        this._soundcloudWidget.seekTo(p);
    }


});
