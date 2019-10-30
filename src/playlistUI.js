
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
            newItem = jQuery(`
                <div data-tid="${t.id}">
                    ${t.title}
                </div>
            `);
            this.$pBoxItems.append(newItem);
            newItem.click((e)=>{
                playerUI.play(e.currentTarget.dataset.tid);
            })
        });
    }



});
