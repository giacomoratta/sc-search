
const playlistMgr = new (class {

    constructor(){
        this.$pBox = jQuery("#sc-playlist");
        this.$pBoxItems = jQuery("#sc-playlist .items");
        this.$pLoadmoreBtn = jQuery("#sc-playlist .pl_loadmore");

        this.$pLoadmoreBtn.click((e)=>{
            scTracksMgr.searchTracks().then((tracks)=>{
                playlistMgr.addTracks(tracks);
            });
        });

        this.currentTrack = {
            element:null,
            id:null
        }
    }

    reset(tracks){
        this.$pBoxItems.html('');
        if(!tracks) return;
        this.addTracks(tracks);
    }

    
    play(element){
        this.currentTrack.element = element;
        this.currentTrack.id = element.dataset.tid;
        playerUI.play(element.dataset.tid);
    }


    playNext(){
    }


    playPrev(){
        
    }


    addTracks(tracks){
        let newItem;
        tracks.forEach((t)=>{
            let awk_img = t.artwork_url || t.user.avatar_url;
            // print track info overview
            // print track stats
            // print user info
            newItem = jQuery(`
                <div class="item" data-tid="${t.id}">
                    <div>
                        <!--widget-->
                    </div>
                    <div class="item_info">
                        <div class="awk"><img src="${awk_img}" /></div>
                        <div class="info">
                            <div class="u">${t.user.username}</div>
                            <div class="t">${t.title}</div>
                            <div class="st">
                                <div class="ct">${t.created_at}</div>
                                <div class="dt">${t.duration/60000}</div>
                                <div class="dt">${t.likes}</div>
                                <div class="dt">${t.play_counter}</div>
                                <div class="dt">${t.download}</div>
                            </div>
                            <div class="uinfo">
                                <div class="lo">${t.user_info.location}</div>
                                <div class="ct">${t.user_info.followers} <button>Follow/Followback</button></div>
                                <div class="lo">${t.user_info.tracks}</div>
                                <div class="dsc">${t.user_info.description}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            this.$pBoxItems.append(newItem);
            newItem.click((e)=>{
                this.play(e.currentTarget)
            })
        });
    }



});
