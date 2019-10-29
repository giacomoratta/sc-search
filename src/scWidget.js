
const scWidget = new (class {

    constructor(){
        this.$elmt = null;
        this._scWidget = null;
        this._scWidgetOptions = {
            volume:20
        };
    }

    createElement(options){
        if(!options) options={};
        this.$elmt = jQuery(`<iframe id="sc_player" src="" style="display: none;" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay"></iframe>`);

        if(options.container){
            jQuery(options.container).prepend(this.$elmt);
        }

        this._scWidget = SC.Widget('sc_player');

        return this.$elmt;
    }


    changeTrack(id){
        this.$elmt.css({display:"block"});

        let basic_url = 'https://w.soundcloud.com/player/?' +
            'url=https%3A//api.soundcloud.com/tracks/'+id+
            '&color=%23000000&auto_play=false&hide_related=true&show_comments=true&' +
            'show_user=true&show_reposts=true&show_teaser=true';

        this.$elmt.attr('src',basic_url);

        window.setTimeout(()=>{
            this.setVolume();
            this.play();
        },1000);
    }


    setVolume(v){
        // v=0-100
        if(!v) v=this._scWidgetOptions.volume;
        this._scWidget.setVolume(v);
    }

    play(v){
        this._scWidget.play();
    }


});
