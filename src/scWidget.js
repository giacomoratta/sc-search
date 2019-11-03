
const scWidget = new (class {

    constructor(){
        this.$elmt = null;
        this.$parent = null;
        this._scWidget = null;
        this._scWidgetOptions = {
            volume:20
        };
    }

    setParent(q){
        this.$parent = jQuery(q);
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

        this._scWidget = SC.Widget('scwdg1');

        window.setTimeout(()=>{
            let player = this._scWidget;
            //player.bind(SC.Widget.Events.READY, function(){ console.log(SC.Widget.Events.READY); });
            //player.bind(SC.Widget.Events.PLAY, function(){ console.log(SC.Widget.Events.PLAY); });
            //player.bind(SC.Widget.Events.PAUSE , function(){ console.log(SC.Widget.Events.PAUSE ); });
            //player.bind(SC.Widget.Events.FINISH , function(){ console.log(SC.Widget.Events.FINISH ); });
            //player.bind(SC.Widget.Events.SEEK  , function(){ console.log(SC.Widget.Events.SEEK  ); });
            this.setVolume();
            this.play();
        },1000);
    }


    play(){
        if(!this._scWidget) return;
        this._scWidget.play();
    }

    stop(){
        if(!this._scWidget) return;
        this._scWidget.pause();
    }


    async getVolume(){
        if(!this._scWidget) return;
        return new Promise((res,rej)=>{
            this._scWidget.getVolume(res);
        });
    }

    setVolume(v){
        // v=0-100
        if(!this._scWidget) return;
        if(v<0 || v>100) v=null;
        if(!v) v=this._scWidgetOptions.volume;
        else this._scWidgetOptions.volume=v;
        this._scWidget.setVolume(v);
    }


    async getDuration(){
        if(!this._scWidget) return;
        return new Promise((res,rej)=>{
            this._scWidget.getDuration(res);
        });
    }

    async getPosition(){
        if(!this._scWidget) return;
        return new Promise((res,rej)=>{
            this._scWidget.getPosition(res);
        });
    }

    async setPosition(p, offset){
        if(!this._scWidget) return;
        const dt = await this.getDuration();
        if(offset===true){
            const cp = await this.getPosition();
            p = p+cp;
        }
        if(p<0 || p>=dt) return;
        this._scWidget.seekTo(p);
    }


});
