
const playerUI = new (class {

    constructor(){
        this.currentTrack = null;

        this.$plBox = jQuery("#sc-player");
        this.$nvBox = jQuery("#sc-pnav");
        this.$nvBoxCommentTextInput = this.$nvBox.find('.comments .comment_text');

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

        this.$nvBox.find('.like').click(async (e)=>{
            let [err,tracks] = await uu.to(soundcloudAPI.likeTrack(playlistMgr.currentTrack.id));
            $d(err,tracks);
        });

        this.$nvBox.find('.repost').click(async (e)=>{
            let [err,tracks] = await uu.to(soundcloudAPI.repostTrack(playlistMgr.currentTrack.id));
            $d(err,tracks);
        });


        this.$nvBox.find('.comments button.comment').click(async (e)=>{
            const comment = {};

            comment.body = this.$nvBoxCommentTextInput.val();
            if(!comment.body || comment.body.length<2) return;

            comment.timestamp = await scWidget.getPosition();
            const tduration = await scWidget.getDuration();
            const tduration_std = tduration*9/10;
            if(!comment.timestamp) comment.timestamp=tduration_std;
            comment.timestamp=Math.max(comment.timestamp,30000);
            comment.timestamp=Math.min(comment.timestamp,tduration_std);
            comment.timestamp=Math.round(comment.timestamp);

            let [err,tracks] = await uu.to(soundcloudAPI.postComment(playlistMgr.currentTrack.id,comment));
            if(err) $d(err,tracks);
            else this.$nvBoxCommentTextInput.val('')
        });


        scWidget.addEventCb(scWidget.EVENTS.FINISH,async()=>{
            $d('playerUI - scWidget FINISH');
            await playlistMgr.playNext();
        });

    }

    play(track_id){
        this.$plBox.show();
        this.currentTrack = scTracksMgr.tracksMap.get(track_id);
        scWidget.changeTrack(track_id, this.currentTrack);
    }

});
