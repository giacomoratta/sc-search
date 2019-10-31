
const trackInfoUI = new (class {

    constructor(){
        this.$tiBox = jQuery("#sc-trackinfo");
        this.$tiBox_trackinfo = this.$tiBox.find(".trackinfo");

        this.$tiBox_buttons = this.$tiBox.find(".buttons");
        this.$tiBox_prevTrack = this.$tiBox_buttons.find(".prev");
        this.$tiBox_nextTrack = this.$tiBox_buttons.find(".next");
        this.$tiBox_likeTrack = this.$tiBox_buttons.find(".like");
        this.$tiBox_repostTrack = this.$tiBox_buttons.find(".repost");

        this.$tiBox_comments = this.$tiBox.find(".comments");
        this.$tiBox_comments_text = this.$tiBox_comments.find("input");
        this.$tiBox_comments_btn = this.$tiBox_comments.find("button");

        this.$tiBox_prevTrack.click((e)=>{
            playlistUI.prev((track)=>{
                if(!track){
                    console.warn("no more tracks");
                    return;
                }
            });
        });

        this.$tiBox_nextTrack.click((e)=>{
            playlistUI.next((track)=>{
                if(!track){
                    console.warn("no more tracks");
                    return;
                }
            });
        });
    }

    xnext(track_id){
        playlistUI.next((nextTrack)=>{
            if(!nextTrack){
                console.warn("no more tracks");
                return;
            }
            //playlistUI.goTo();
            //playlistUI.play()
        });
    }

});
