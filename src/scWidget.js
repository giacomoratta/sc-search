
const scWidget = new (class {

    constructor(){
        this.$elmt = null;
        this.$parent = null;
        this._soundcloudWidget = null;
        this._soundcloudWidgetOptions = {
            volume:20
        };

        this.EVENTS = SC.Widget.Events;
        this.EventCallbacks = {};
    }

    setParent(q){
        this.$parent = jQuery(q);
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


    changeTrack(id){
        this.stop();
        if(this.$elmt) this.$elmt.remove();

        let basic_url = 'https://w.soundcloud.com/player/?' +
            'url=https%3A//api.soundcloud.com/tracks/'+id+
            '&color=%23000000&auto_play=true&hide_related=true&show_comments=false&' +
            'show_user=false&show_reposts=false&show_teaser=false';

        this.$elmt = jQuery(`<iframe id="scwdg1" src="${basic_url}" width="100%" height="126" scrolling="no" frameborder="no" allow="autoplay"></iframe>`);
        this.$parent.prepend(this.$elmt);

        this._soundcloudWidget = SC.Widget('scwdg1');
        this.setVolume();

        window.setTimeout(()=>{
            let player = this._soundcloudWidget;
            this.bindEvents(player);
            //player.bind(SC.Widget.Events.READY, function(){ $d(SC.Widget.Events.READY); });
            //player.bind(SC.Widget.Events.PLAY, function(){ $d(SC.Widget.Events.PLAY); });
            //player.bind(SC.Widget.Events.PAUSE , function(){ $d(SC.Widget.Events.PAUSE ); });
            //player.bind(SC.Widget.Events.FINISH , function(){ $d(SC.Widget.Events.FINISH ); });
            //player.bind(SC.Widget.Events.SEEK  , function(){ $d(SC.Widget.Events.SEEK  ); });
            this.play();
            this.setVolume();
        },800);
    }


    play(){
        if(!this._soundcloudWidget) return;
        this._soundcloudWidget.play();
    }

    stop(){
        if(!this._soundcloudWidget) return;
        this._soundcloudWidget.pause();
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
        //$d(this._soundcloudWidgetOptions.volume);
        this._soundcloudWidget.setVolume(v);
    }


    async getDuration(){
        if(!this._soundcloudWidget) return;
        return new Promise((res,rej)=>{
            this._soundcloudWidget.getDuration(res);
        });
    }

    async getPosition(){
        if(!this._soundcloudWidget) return;
        return new Promise((res,rej)=>{
            this._soundcloudWidget.getPosition(res);
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
