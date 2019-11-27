
const playerUI = new (class {

    constructor(){
        this.currentTrack = null;

        this.$plBox = jQuery("#sc-player");
        this.$nvBox = jQuery("#sc-pnav");
        this.$acBox = jQuery("#sc-artwkctrls");
        this.$nfBox = jQuery("#sc-pinfo");
        this.$cmBox = jQuery("#sc-comments");
        this.$cmBoxTextInput = this.$cmBox.find('.comment_text');

        this.$wfBox = jQuery("#sc-pwaveform");
        this.$wfBoxFull = this.$wfBox.find('.full');
        this.$wfBoxProg = this.$wfBox.find('.prog');


        this.$acBox.find('.vol-less').click((e)=>{
            const v = scWidget.getVolume();
            scWidget.setVolume(v-10);
        });

        this.$acBox.find('.vol-more').click((e)=>{
            const v = scWidget.getVolume();
            scWidget.setVolume(v+10);
        });


        this.$nvBox.find('.play').click(async (e)=>{
            if(scWidget.playToggle()===true){
                this.$nvBox.find('.play').html('&#9723;');
            }else{
                this.$nvBox.find('.play').html('&#9655;');
            }
        });

        this.$wfBoxFull.click((e)=>{
            const dt = scWidget.getDuration();
            scWidget.setPosition(dt * e.offsetX / this.$wfBoxFull.width(),false);
            scWidget.callProgressionCb();
        });

        this.$nvBox.find('.skip-fw').click((e)=>{
            scWidget.setPosition(20,true);
            scWidget.callProgressionCb();
        });

        this.$nvBox.find('.skip-rw').click((e)=>{
            scWidget.setPosition(-20,true);
            scWidget.callProgressionCb();
        });

        this.$nvBox.find('.prev').click((e)=>{
            playlistMgr.playPrev();
        });

        this.$nvBox.find('.next').click(async (e)=>{
            await playlistMgr.playNext();
        });

        this.$acBox.find('.like').click(async (e)=>{
            let [err,tracks] = await uu.to(soundcloudAPI.likeTrack(playlistMgr.currentTrack.id));
            $d(err,tracks);
        });

        this.$acBox.find('.repost').click(async (e)=>{
            let [err,tracks] = await uu.to(soundcloudAPI.repostTrack(playlistMgr.currentTrack.id));
            $d(err,tracks);
        });


        this.$cmBox.find('button.comment').click(async (e)=>{
            const comment = {};

            comment.body = this.$cmBoxTextInput.val();
            if(!comment.body || comment.body.length<2) return;

            comment.timestamp = scWidget.getPosition();
            const tduration = scWidget.getDuration();
            const tduration_std = tduration*9/10;
            if(!comment.timestamp) comment.timestamp=tduration_std;
            comment.timestamp=Math.max(comment.timestamp,30000);
            comment.timestamp=Math.min(comment.timestamp,tduration_std);
            comment.timestamp=Math.round(comment.timestamp);

            let [err,tracks] = await uu.to(soundcloudAPI.postComment(playlistMgr.currentTrack.id,comment));
            if(err) $d(err,tracks);
            else this.$cmBoxTextInput.val('')
        });


        scWidget.addEventCb(scWidget.EVENTS.ENDED,async ()=>{
            $d('playerUI - scWidget ENDED');
            await playlistMgr.playNext();
        });

        // scWidget.addEventCb(scWidget.EVENTS.PROGRESS,()=>{
        //     $d('playerUI - scWidget PROGRESS');
        //     this.setProgressionStatus();
        // });

        scWidget.setProgressionCb((currentTime, currentTimePerc, duration)=>{
            this.$wfBoxProg.css({ 'width':currentTimePerc+'%' });
        });

        navigator.mediaSession.setActionHandler('previoustrack', async ()=>{
            $d('playerUI - navigator.previoustrack');
            await playlistMgr.playPrev();
        });

        navigator.mediaSession.setActionHandler('nexttrack', async ()=>{
            $d('playerUI - navigator.nexttrack');
            await playlistMgr.playNext();
        });

    }


    updateInfo(){
        const t = this.currentTrack;

        const $artwork_img = this.$acBox.find('.artwork img');
        $artwork_img.attr('src',t.artwork_url || t.user.avatar_url);
        $artwork_img.attr('title',t.user.username+' - '+t.title);
        $artwork_img.attr('alt',t.user.username+' - '+t.title);

        this.$nfBox.find('.artist').html(t.user.username);
        this.$nfBox.find('.title').html(t.title);

        this.$wfBoxFull.css({ 'background-image':"url('"+t.waveform_url+"')" });
        //this.$wfBoxProg.css({ 'background-image':"url('"+t.waveform_url+"')" });
    }



    play(track_id){
        this.$plBox.show();
        this.currentTrack = scTracksMgr.tracksMap.get(track_id);

        this.updateInfo();
        scWidget.changeTrack(track_id, this.currentTrack);

        this.setPlayingStatus();
    }



    setPlayingStatus(){
        this.$nvBox.find('.play').html('&#9723;');
    }

});
