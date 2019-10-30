
const playlistUI = new (class {

    constructor(){
        this.$pBox = jQuery("#sc-playlist");
        this.$pBoxItems = jQuery("#sc-playlist .items");
        this.$pLoadmoreBtn = jQuery("#sc-playlist .pl_loadmore");

        this.$pLoadmoreBtn.click((e)=>{
            scTracksMgr.searchTracks().then((tracks)=>{
                playlistUI.addTracks(tracks);
            });
        });
    }

    reset(tracks){
        this.$pBoxItems.html('');
        if(!tracks) return;
        this.addTracks(tracks);
    }

    addTracks(tracks){
        let newItem;
        tracks.forEach((t)=>{
            let awk_img = t.artwork_url || t.user.avatar_url;
            newItem = jQuery(`
                <div class="item" data-tid="${t.id}">
                    <div class="awk"><img src="${awk_img}" /></div>
                    <div class="info">
                        <div class="t">${t.title}</div>
                        <div class="u">${t.user.username}</div>
                        <div class="ct">${t.created_at}</div>
                        <div class="dt">${t.duration/60000}</div>
                    </div>
                </div>
            `);
            this.$pBoxItems.append(newItem);
            newItem.click((e)=>{
                playerUI.play(e.currentTarget.dataset.tid);
            })
        });
    }



});
