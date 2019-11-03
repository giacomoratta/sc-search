
const playerUI = new (class {

    constructor(){
        this.currentTrack = null;

        this.$plBox = jQuery("#sc-player");
        this.$nvBox = jQuery("#sc-pnav");

        this.$nvBox.find('.vol-less').click(async (e)=>{
            const v = await scWidget.getVolume();
            scWidget.setVolume(v-10);
        });
        this.$nvBox.find('.vol-more').click(async (e)=>{
            const v = await scWidget.getVolume();
            scWidget.setVolume(v+10);
        });
        this.$nvBox.find('.skip-rw').click(async (e)=>{
            scWidget.setPosition(-20*1000,true);
        });
        this.$nvBox.find('.skip-fw').click(async (e)=>{
            scWidget.setPosition(20*1000,true);
        });


        this.$nvBox.find('.prev').click((e)=>{
            playlistMgr.playPrev();
        });

        this.$nvBox.find('.next').click(async (e)=>{
            await playlistMgr.playNext();
        });

        this.$nvBox.find('.like').click((e)=>{
            scTracksMgr.likeTrack(playlistMgr.currentTrack.id);
        });

        this.$nvBox.find('.repost').click((e)=>{
            scTracksMgr.repostTrack(playlistMgr.currentTrack.id);
        });
    }

    play(track_id){
        scWidget.changeTrack(track_id);
        this.currentTrack = scTracksMgr.tracksMap.get(track_id);
    }

});
