
const playerUI = new (class {

    constructor(){
        this.$pBox = jQuery("#sc-player");
    }

    play(track_id){
        scWidget.changeTrack(track_id);
    }

});
