
const filterUI = new (class {

    constructor(){
        this.$fBox = jQuery("#sc-filter");
        this.$fOpen = jQuery("#sc-filter .open");
        this.$fClose = jQuery("#sc-filter .close");
        this.$fOpenButton = jQuery("#sc-filter .open button.toggle");
        this.$fCloseButton = jQuery("#sc-filter .close button.toggle");
        this.$fSearchButton = jQuery("#fr_gosearch");

        this.$fCloseButton.click((e)=>{
            this.$fClose.hide();
            this.$fOpen.show(200);
        });

        this.$fOpenButton.click((e)=>{
            this.$fClose.show();
            this.$fOpen.hide(200);
        });

        this.$fSearchButton.click((e)=>{
            const filterData = this.getFilterData();
            scTracksMgr.reset();
            scTracksMgr.searchTracks(filterData).then((tracks)=>{
                console.log(tracks);
                playlistUI.reset(tracks);
            });
        });
    }


    getFilterData(){

    }

});
