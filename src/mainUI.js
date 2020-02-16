const mainUI = new (class {

    constructor(){

        this.$overlay1 = jQuery('#overlay1');

        this.$tabsBox = jQuery("#sc-tabs");
        this.$tOpenButton = this.$tabsBox.find("button.ot-filter");
        this.$tOpenPlaylist = this.$tabsBox.find("button.ot-playlist");

        this.$tOpenButton.click((e)=>{
            filterUI.toggleBox();
        });

        this.$tOpenPlaylist.click((e)=>{
            playlistMgr.togglePlaylistUI();
        });
    }




});
