
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
        let newItem, awk_img, created_at;
        tracks.forEach((t)=>{
            awk_img = t.artwork_url || t.user.avatar_url;
            created_at = new Date(t.created_at);
            // print track info overview
            // print track stats
            // print user info
            //
            //

            newItem = jQuery(`
                <div class="item" data-tid="${t.id}">
                    <div class="awk"><img src="${awk_img}" /></div>
                    <div class="iinfo">
                        <div class="username">${t.user_info.username}</div>
                        <div class="title">${t.title}</div>
                        <div class="small duration">Duration: ${uu.string.msToDuration(t.duration)}</div>
                        <div class="small created_at">Created at: ${created_at.getFullYear()}/${created_at.getMonth()+1}/${created_at.getDate()}</div>
                    </div>
                    <div class="kv_box small tstats">
                        <div class="likes"><span class="value">${t.likes_count}</span> <span class="label">likes</span> //</div>
                        <div class="plays"><span class="value">${t.playback_count}</span> <span class="label">plays</span> //</div>
                        <div class="reposts"><span class="value">${t.reposts_count}</span> <span class="label">reposts</span></div>
                        ${t.downloadable ? `// <div class="downloads"><span class="value">${t.download_count}</span> <span class="label">downloads</span></div>` : '' }
                        ${t.downloadable ? `// <div class="downloadable"><strong>D</strong></div>` : '' }
                    </div>
                    <div class="kv_box small ustats">
                        ${(t.user_info.country || t.user_info.city) ? `<div class="location">${t.user_info.country ? `${t.user_info.country}` : '' }${t.user_info.city ? `, ${t.user_info.city}` : '' } //</div>` : '' }
                        <div class="followers"><span class="value">${t.user_info.followers_count}</span> <span class="label">followers</span> //</div>
                        <div class="tracks"><span class="value">${t.user_info.track_count}</span> <span class="label">tracks</span></div>
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
